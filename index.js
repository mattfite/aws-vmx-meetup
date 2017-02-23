console.log('Loading function');

exports.handler = function(event, context, callback) {
    // This example code only throws error. 
    var error = new Error("something is wrong");
    callback(error);
   
};
