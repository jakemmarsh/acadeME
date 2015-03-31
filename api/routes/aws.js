'use strict';

var when   = require('when');
var _      = require('lodash');
var Knox   = require('knox');
var crypto = require('crypto');
var moment = require('moment');
var mime   = require('mime-types');
var models = require('../models');

/* ====================================================== */

var AWS = Knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: process.env.S3_BUCKET
});

/* ====================================================== */

function convertPdfToImage(file, type, entityId) {

  var deferred = when.defer();
  var extension = mime.extensions[file.mimetype][0];
  // var bufs = [];

  // if ( extension === 'pdf' ) {
  //   gm(file.buffer, file.name + '.jpeg').stream(function(err, stdout) {
  //     if ( err ) {
  //       deferred.reject({ status: 500, body: err });
  //     } else {
  //       extension = 'jpg';

  //       stdout.on('data', function(d) { bufs.push(d); });

  //       stdout.on('end', function() {
  //         file.buffer = Buffer.concat(bufs);
  //         file.size = _.reduce(bufs, function(sum, buf) { return sum + buf.length; });
  //         deferred.resolve([file, type, entityId, extension]);
  //       });
  //     }
  //   });
  // } else {
    deferred.resolve([file, type, entityId, extension]);
  // }

  return deferred.promise;

}

/* ====================================================== */

function uploadToAWS(data) {

  var deferred = when.defer();
  var file = data[0];
  var type = data[1];
  var entityId = data[2];
  var extension = data[3];
  var datePrefix = moment().format('YYYY[/]MM');
  var key = crypto.randomBytes(10).toString('hex');
  var headers = {
    'Content-Length': file.size,
    'Content-Type': file.mimetype,
    'x-amz-acl': 'public-read'
  };
  var path = '/';

  switch ( type ) {
    case 'attachment':
      path += 'attachments/';
      break;
    default:
      path += type + '_imgs/';
  }

  path += datePrefix + '/' + key + '.' + extension;

  AWS.putBuffer(file.buffer, path, headers, function(err, response){
    if ( err || response.statusCode !== 200 ) {
      console.error('error putting buffer: ', new Date(), err);
      deferred.reject({ status: response.statusCode, error: err });
    } else {
      console.log('File uploaded! Amazon response statusCode: ', response.statusCode);
      deferred.resolve([type, entityId, path, file.name]);
    }
  });

  return deferred.promise;

}

/* ====================================================== */

function updateEntity(data) {

  var deferred = when.defer();
  var type = data[0];
  var id = data[1];
  var filePath = 'http://' + process.env.S3_BUCKET + '.s3.amazonaws.com' + data[2];
  var model;

  switch ( type ) {
    case 'lesson':
      model = models.Lesson;
      break;
    case 'course':
      model = models.Course;
      break;
    case 'user':
      model = models.User;
      break;
  }

  model.find({
    where: { id: id }
  }).then(function(item) {
    if ( !_.isEmpty(item) ) {
      item.updateAttributes({
        imageUrl: filePath
      }).then(function() {
        deferred.resolve(filePath);
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

function saveAttachment(data) {

  var deferred = when.defer();
  var filePath = 'http://' + process.env.S3_BUCKET + '.s3.amazonaws.com' + data[2];
  var filename = data[3];
  var attachment = {
    url: filePath,
    name: filename
  };

  models.Attachment.create(attachment).then(function(savedAttachment) {
    deferred.resolve(savedAttachment);
  }).catch(function(err) {
    deferred.reject({ status: 500, body: err });
  });

  return deferred.promise;

}

/* ====================================================== */

exports.uploadFile = function(req, res) {

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
      res.status(500).json({ error: err });
    });

    file.on('end', function() {
      var finalBuffer = Buffer.concat(this.fileRead);
      var finalFile = {
        buffer: finalBuffer,
        size: finalBuffer.length,
        name: req.params.filename || filename,
        mimetype: mimetype
      };
      var updateFunction = req.params.type === 'attachment' ? saveAttachment : updateEntity;

      convertPdfToImage(finalFile, req.params.type, req.params.id)
      .then(uploadToAWS)
      .then(updateFunction).then(function(data) {
        if ( typeof data === 'string' ) {
          res.status(200).json({ url: data });
        } else {
          res.status(200).json(data);
        }
      }).catch(function(err) {
        res.status(err.status).json({ error: err.body });
      });
    });
  });

};