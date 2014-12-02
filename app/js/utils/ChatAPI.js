'use strict';

var qs       = require('querystring');
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

  getConversation: function(courseId, currentUserId, recipientId) {
    var deferred = when.defer();
    var sortedIds = [currentUserId, recipientId].sort();
    var queryString = qs.stringify({
      userOne: sortedIds[0],
      userTwo: sortedIds[1]
    });

    request.get(APIUtils.API_ROOT + 'chat/' + courseId + '/conversation?' + queryString).end(function(res) {
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