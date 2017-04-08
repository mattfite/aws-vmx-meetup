'use strict';

const AWS = require('aws-sdk'),
      kms = new AWS.KMS();

/**
 * Decrypts a Base64 encoded encrypted message
 * @param {string} message - Message to decrypt
 * @returns {Promise<string>} Plain text message on resolve or error message on reject
 */
const decrypt = (message) => {
    const clean = new Buffer(message, 'base64'),
          params = {
              CiphertextBlob: clean
          };

    return new Promise((resolve, reject) => {
        kms.decrypt(params, function(err, data) {
            if (err) {
                return reject(err);
            }

            let text = new Buffer(data.Plaintext).toString('ascii');

            return resolve(text);
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
 * Decrypts and creates a JSON HTTP response object
 * @param {Object} event - ?
 * @returns {Promise<Object>} HTTP response object on resolve or reject
 */
const post = (event, context, callback) => {
    let payload = event.body,
        obj = JSON.parse(payload),
        message = obj.data;

    decrypt(message)
        .then((text) => {
            callback(null, createResponse(200, {
                data: text
            }));
        })
        .catch((err) => {
            callback(err, createResponse(500, {
                error: err
            }));
        });
};

module.exports.post = post;
