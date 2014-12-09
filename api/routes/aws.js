'use strict';

var when   = require('when');
var _      = require('lodash');
var Knox   = require('knox');
var crypto = require('crypto');
var moment = require('moment');
var mime   = require('mime-types');
var config = require('../../config');
var models = require('../models');

/* ====================================================== */

var AWS = Knox.createClient({
  key: config.aws.key,
  secret: config.aws.secret,
  bucket: config.aws.bucket
});

/* ====================================================== */

function uploadToAWS(file, type, entityId) {

  var deferred = when.defer();
  var datePrefix = moment().format('YYYY[/]MM');
  var key = crypto.randomBytes(10).toString('hex');
  var hash = key + '-' + entityId;
  var path = '/' + type + '_imgs/' + datePrefix + '/' + hash + '.' + mime.extensions[file.mimetype];
  var headers = {
    'Content-Length': file.size,
    'Content-Type': file.mimetype,
    'x-amz-acl': 'public-read'
  };

  AWS.putBuffer(file.buffer, path, headers, function(err, response){
    if ( err || response.statusCode !== 200 ) {
      console.error('error streaming image: ', new Date(), err);
      deferred.reject({ status: response.statusCode, error: err });
    } else {
      console.log('File uploaded! Amazon response statusCode: ', response.statusCode);
      deferred.resolve([type, entityId, path]);
    }
  });

  return deferred.promise;

}

/* ====================================================== */

function updateEntity(data) {

  var deferred = when.defer();
  var type = data[0];
  var id = data[1];
  var imagePath = data[2];
  var model = (type === 'lesson') ? models.Lesson : models.Course;

  model.find({
    where: { id: id }
  }).then(function(item) {
    if ( !_.isEmpty(item) ) {
      item.updateAttributes({
        imageUrl: 'https://' + config.aws.bucket + '.s3.amazonaws.com' + imagePath
      }).then(function(updatedItem) {
        deferred.resolve(updatedItem);
      }).catch(function(err) {
        deferred.reject({ status: 500, body: err });
      });
    } else {
      deferred.reject({ status: 404, body: 'Entity could not be found at the ID: ' + id });
    }
  }).catch(function(err) {
    deferred.reject({ status: 500, body: err });
  });

  return deferred.promise;

}

/* ====================================================== */

exports.uploadImage = function(req, res) {

  req.pipe(req.busboy);

  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    // If filename is not truthy it means there's no file
    if ( !filename ) {
      res.status(400).json({ error: 'No file' });
      return;
    }

    file.fileRead = [];

    file.on('data', function(chunk) {
      this.fileRead.push(chunk);
    });

    file.on('error', function(err) {
      console.log('Error while buffering the stream: ', err);
      res.status(500).json({ error: err });
    });

    file.on('end', function() {
      var finalBuffer = Buffer.concat(this.fileRead);
      var finalFile = {
        buffer: finalBuffer,
        size: finalBuffer.length,
        filename: filename,
        mimetype: mimetype
      };

      uploadToAWS(finalFile, req.params.type, req.params.id).then(updateEntity).then(function() {
        res.status(200).json('Image successfully uploaded and entity imageUrl updated.');
      }).catch(function(err) {
        console.log('error uploading:', err);
        res.status(err.status).json({ error: err.body });
      });
    });
  });

};