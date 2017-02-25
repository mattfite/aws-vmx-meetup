'use strict';

console.log('Loading function');

var AWS = require('aws-sdk');
// TODO
// this could be passed in with Environment variable
const myBucket = 'mattfite.photo';

const createResponse = (statusCode, body) => {
    return {
        "headers": { 'Content-Type': 'application/json' },
        "statusCode": statusCode,
        "body": body || ""
    };
};

exports.getAlbums = (event, context, callback) => {
    var s3 = new AWS.S3();
    var response;
    var json = {};
    var albums = [];

    var params = {
      Bucket:		myBucket,
      Delimiter:	'/',
      Prefix:		'albums/'
    };

    s3.listObjects(params, function(err, data) {
      if (err) {
          console.error(err, err.stack);
          response = createResponse(500, JSON.stringify(err) );
          callback(err, "failure" );
      }
      else {
          for (var value of data.CommonPrefixes){
              albums.push({'link': value.Prefix});
          }
          json.albums = albums;
          response = createResponse(200, JSON.stringify(json) );
          console.log(response);
          callback(null, response);
      }

      // why not this?
      //callback(null, response);

    });
};

exports.getImages = (event, context, callback) => {
    var s3 = new AWS.S3();
    var response;
    var json = {};
    var images = [];
    var path = 'albums/' + event.pathParameters.albumId + '/';

    //console.log("path: " + path );
    //console.log("event: " + JSON.stringify(event) );

    var params = {
      Bucket:		myBucket,
      Delimiter:	'/',
      Prefix:		path
    };

    s3.listObjects(params, function(err, data) {
      if (err) {
          console.error(err, err.stack);
          response = createResponse(500, JSON.stringify(err) );
          callback(err, "failure" );
      }
      else {
          //console.log("data.Contents: " + JSON.stringify(data.Contents));
          for (var value in data.Contents){
              images.push({'path': data.Contents[value].Key, 'thumb_path': data.Contents[value].Key});
          }
          json.images = images;
          response = createResponse(200, JSON.stringify(json) );
          console.log(response);
          callback(null, response);
      }

      // why not this?
      //callback(null, response);

    });
};
