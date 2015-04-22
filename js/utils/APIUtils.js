'use strict';

var humps             = require('humps');
var request           = require('superagent');
var when              = require('when');

var root              = 'http://localhost:3000/api/';

/* ====================================================== */

function normalizeResponse(response) {
  return humps.camelizeKeys(response.body);
}

/* ====================================================== */

function createRequest(verb, path, body) {
  var req;

  if ( typeof window !== 'undefined' && navigator.userAgent !== 'jsdom' ) {
    // .withCredentials() is only available client-side
    req = request[verb](root + path, body).withCredentials();
  } else if ( navigator.userAgent === 'jsdom' && global.agent ) {
    // use global.agent when in testing environment to ensure cookies are set/used
    req = global.agent[verb](path).send(body);
  } else {
    req = request[verb](root + path, body);
  }

  return req;
}

/* ====================================================== */

var APIUtils = {

  root: root,

  get: function(path) {
    var deferred = when.defer();

    createRequest('get', path)
    .end(function(err, res) {
      if ( err ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  post: function(path, body) {
    var deferred = when.defer();

    createRequest('post', path, body)
    .end(function(err, res) {
      if ( err ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  put: function(path, body) {
    var deferred = when.defer();

    createRequest('put', path, body)
    .end(function(err, res) {
      if ( err ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  del: function(path) {
    var deferred = when.defer();

    createRequest('del', path)
    .end(function(err, res) {
      if ( err ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  uploadFile: function(path, file) {
    var deferred = when.defer();

    createRequest('post', path)
    .attach('file', file)
    .end(function(err, res){
      if ( err ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = APIUtils;