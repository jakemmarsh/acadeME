'use strict';

var qs       = require('querystring');

var APIUtils = require('./APIUtils');

var ChatAPI = {

  getCourseRecipients: function(courseId) {
    return APIUtils.get('chat/'+ courseId + '/recipients');
  },

  getConversation: function(courseId, currentUserId, recipientId) {
    var sortedIds = [currentUserId, recipientId].sort();
    var params = qs.stringify({
      userOne: sortedIds[0],
      userTwo: sortedIds[1]
    });

    return APIUtils.get('chat/'+ courseId + '/conversation?' + params);
  }

};

module.exports = ChatAPI;