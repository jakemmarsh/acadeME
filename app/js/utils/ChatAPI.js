'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var ChatAPI = {

  getCourseRecipients: function(courseId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'chat/' + courseId + '/recipients').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getConversation: function(currentUserId, courseId, recipientId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'chat/' + courseId + '/conversation').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = ChatAPI;