var AWS = require('aws-sdk');
var apiVersion = "2015-10-01";
var results = {};
var semaphore = { "describe": 0, "terminate": 0};	// A quick and CPU cheap way to enforce asynchronous signaling (essentially a Promise)
var shouldTerminateInstances = true; // For testing purposes

/* this is a hack */
const regions = [{ 'region': 'us-west-2'}];
const myRegion = 'us-west-2';

/**
 * The "main" function which AWS Lambda executes.
 */
exports.handler = function(event, context) {

    // For each region specified
    for(var i = 0; i < regions.length; i++) {
        semaphore.describe++;
        var region = regions[i];
        var ec2 = new AWS.EC2({region:myRegion, apiVersion:apiVersion});
        var request = ec2.describeInstances({DryRun:false});

        // On a successful describe, execute the following callback
        request.on("success", function(response) {
            var region = response.request.service.config.region;
            var data = response.data;
            var ids = [];
            
            console.log("========== describe instances ==========");
            console.log(JSON.stringify(data));
            console.log("========== end describe ==========");
            
            for(var i = 0; i < data.Reservations.length; i++) {
                var Instances = data.Reservations[i].Instances;
                for(var j = 0; j < Instances.length; j++) {
                    var instance = Instances[j];
                    console.log("found instances: " + instance.InstanceId );
                    if(isTagless2(instance)) {
                        ids.push(instance.InstanceId);
                        console.log("terminating instance: " + instance.InstancdId );
                    }
                }
            }
            announce(region, ids);

            // If some Instances have been identified, attempt to terminate
            if(ids.length > 0) {
                semaphore.terminate++;
                var ec2 = new AWS.EC2(response.request.service.config);
                var request = ec2.terminateInstances({DryRun:!shouldTerminateInstances, InstanceIds:ids});	// Defaulting to DryRun true when terminating Instances

                // Callback for successful terminate
                request.on("success", function(response) {
                    var region = response.request.service.config.region;
                    var body = JSON.stringify(response.data);
                    results[region] = response.data;
                    announce(region, body);
                });

                // Callback for error terminate
                request.on("error", cbError);

                // Callback when terminating attempt has finished, successful or not -- decrement the terminate semaphore and check if finished
                request.on("complete", function() {
                    semaphore.terminate--;
                    if(describingDone() && terminatingDone()) {
                        context.succeed(results);
                    }
                });

                request.send();	// Issue the terminate request

            }
        });

        // Callback for error describe
        request.on("error", cbError);

        // Callback when describing attempt has finished, successful or not -- decrement the describe semaphore and check if finished
        request.on("complete", function() {
            semaphore.describe--;
            if(describingDone() && terminatingDone()) {
                context.succeed(results);
            }
        });

        request.send();	// Issue the describe request
    }
};

/**
 * A simple logging function used for printing to AWS Lambda logs.
 */
function announce(region, message) {
    if(region !== null) { d = "=========="; console.log(d + " " + region + " " + d); }
    console.log(message);
}
/**
 * Generic callback used for error responses.
 */
function cbError(error, response) {
    results[response.request.service.config.region] = error;
    announce(response.request.service.config.region, JSON.stringify(error));
}
/**
 * Return true if all describing calls are finished, false otherwise.
 */
function describingDone() {
    if(isDone(semaphore.describe)) { return true; }
    return false;
}
/**
 * Return true if all terminating calls are finished, false otherwise.
 */
function terminatingDone() {
    if(isDone(semaphore.terminate)) { return true; }
    return false;
}
function isDone(counter) {
    return counter === 0;
}
/**
 * Return true if a given Instance is considered tagless, false otherwise.
 */
function isTagless(instance) {
    try {
        console.log("tags: " + instance.Tags.length );
        if(!instance.Tags || instance.Tags.length === 0) { return true; }
        if(instance.Tags.length == 1)
            if(instance.Tags[0].Key == "Name" && instance.Tags[0].Value === "")
                return true;
    } catch(e) {}
    console.log("isTagless() false ");
    return false;
}
function isTagless2(instance) {
    try {
        console.log("tags: " + instance.Tags.length );
        if(!instance.Tags || instance.Tags.length === 0) { return true; }
        if(instance.Tags.length == 1)
            if(instance.Tags[0].Key == "Name" && instance.Tags[0].Value === "")
                return true;
        var found = false;
        for(let s of instance.Tags) {
            if(s.Key == "Development" && s.Value === "" )
                found = true;
        }
        console.log("isTagless2() returning " + !found );
        return !found;
    } catch(e) {}
    console.log("isTagless2() false ");
    return false;
}
