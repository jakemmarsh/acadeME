'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var AuthAPI = {

  check: function() {
    var deferred = when.defer();

    // request.get(APIUtils.API_ROOT + 'auth/check').end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(JSON.parse(res.text));
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      id: 4,
      username: 'jakemmarsh',
      name: 'Jake Marsh',
      type: 'instructor',
      imageUrl: 'https://scontent-b-lga.xx.fbcdn.net/hphotos-xpf1/t31.0-8/1796992_10151957242618173_179336983_o.jpg'
    });

    return deferred.promise;
  },

  register: function(user) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'auth/register', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  login: function(user) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'auth/login', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  logout: function() {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'auth/logout').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = AuthAPI;