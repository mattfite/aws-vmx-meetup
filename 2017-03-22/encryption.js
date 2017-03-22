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
	const key_id = process.env.keyId;
	var message = event.body;
	console.log("event.body: " + message);
	var params = { KeyId: key_id, Plaintext: message };
	
	kms.encrypt(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    	var encrypted_data = "foo";
			var json = {};
			var response;

                        encrypted_data = new Buffer(data.CiphertextBlob).toString('base64');
                        console.log("encrypted_message: " + encrypted_data);
                        json = {'data': encrypted_data};
                        response = createResponse(200, JSON.stringify(json));
                        console.log("response: " + response);
			callback(null, response);
                }
        });
};
