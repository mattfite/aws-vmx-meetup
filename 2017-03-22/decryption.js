'use strict';

var AWS = require('aws-sdk');

var kms = new AWS.KMS();

const createResponse = (statusCode, body) => {
    return {
        "headers": { 'Content-Type': 'application/json' },
        "statusCode": statusCode,
        "body": body || ""
    };
};

exports.post = (event, context, callback) => {
	var payload = event.body;
	var obj = JSON.parse(payload);
	var message = obj.data;
	var json;
	var response;
	var clean = new Buffer(message, 'base64');

	var params = {CiphertextBlob: clean };
	kms.decrypt(params, function(err, data ) {
		if (err) console.log(err, err.stack);
		else {
			//console.log("bytes: " + new Buffer(data.Plaintext).toString('ascii'));
			json = {'data': new Buffer(data.Plaintext).toString('ascii') };
			response = createResponse(200, JSON.stringify(json));
			callback(null, response );
		}
	});
};
