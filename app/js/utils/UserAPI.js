'use strict';

var when     = require('q');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(identifier) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + identifier).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = UserAPI;