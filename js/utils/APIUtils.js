'use strict';

var humps             = require('humps');
var request           = require('superagent');
var when              = require('when');

/* ====================================================== */

function normalizeResponse(response) {
  return humps.camelizeKeys(response.body);
}

/* ====================================================== */

function createRequest(verb, path, body) {
  var req;

  if ( typeof window !== 'undefined' ) {
    req = request[verb](path, body).withCredentials();
  } else {
    req = request[verb](path, body);
  }

  return req;
}

/* ====================================================== */

var APIUtils = {

  root: 'http://localhost:3000/api/',

  get: function(path) {
    var deferred = when.defer();

    createRequest('get', this.root + path)
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  post: function(path, body) {
    var deferred = when.defer();

    createRequest('post', this.root + path, body)
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  put: function(path, body) {
    var deferred = when.defer();

    createRequest('put', this.root + path, body)
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  del: function(path) {
    var deferred = when.defer();

    createRequest('del', this.root + path)
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  uploadFile: function(path, file) {
    var deferred = when.defer();

    createRequest('post', this.root + path)
    .attach('file', file)
    .end(function(res){
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = APIUtils;