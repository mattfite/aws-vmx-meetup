'use strict';

const AWS = require('aws-sdk'),
      kms = new AWS.KMS();

/**
 * Encrypts a message
 * @param {string} key - Key to use for encryption
 * @param {string} message - Message to encrypt
 * @returns {Promise<string>} Base64 encoded encrypted message on resolve or error message on reject
 */
const encrypt = (key, message) => {
    const params = {
        KeyId: key,
        Plaintext: message
    };

    return new Promise((resolve, reject) => {
        kms.encrypt(params, function(err, data) {
            if (err) {
                return reject(err);
            }

            let encryptedData = new Buffer(data.CiphertextBlob).toString('base64');

            return resolve(encryptedData);
        });
    });
};

/**
 * Creates a JSON HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} body - Contents of the response
 * @returns {Object}
 */
const createResponse = (statusCode, body) => {
    body = body || {};

    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
};

/**
 * Encrypts and creates a JSON HTTP response object
 * @param {Object} event - ?
 * @returns {Promise<Object>} HTTP response object on resolve or reject
 */
const post = (event, context, callback) => {
    const key = process.env.keyId,
          message = event.body;

    encrypt(key, message)
        .then((encryptedData) => {
            callback(null, createResponse(200, {
                data: encryptedData
            }));
        })
        .catch((err) => {
            callback(err, createResponse(500, {
                error: err.stack
            }));
        });
};

module.exports.post = post;
