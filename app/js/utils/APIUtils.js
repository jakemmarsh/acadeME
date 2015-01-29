'use strict';

var humps             = require('humps');
var request           = require('superagent');
var when              = require('when');
var normalizeResponse = function(response) {
  return humps.camelizeKeys(response.body);
};

var APIUtils = {

  root: '/api/',

  get: function(path) {
    var deferred = when.defer();

    request.get(this.root + path).end(function(res) {
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

    request.post(this.root + path, body).end(function(res) {
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

    request.put(this.root + path, body).end(function(res) {
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

    request.del(this.root + path).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  uploadImage: function(path, image) {
    var deferred = when.defer();

    request.post(path)
    .attach('image', image)
    .end(function(res){
      if ( !res.ok ) {
        deferred.reject(normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = APIUtils;