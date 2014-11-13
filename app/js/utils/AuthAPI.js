'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var AuthAPI = {

  register: function(user) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'register', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  login: function(user) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'login', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  logout: function(user) {
    var deferred = when.defer();

    deferred.resolve();

    return deferred.promise;
  }

};

module.exports = AuthAPI;