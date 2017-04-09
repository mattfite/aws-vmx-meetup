/**
 * Creates a JSON HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} body - Contents of the response
 * @returns {Object}
 */
const create = (statusCode, body) => {
    body = body || {};

    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
};

exports.create = create;
