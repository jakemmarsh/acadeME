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
  },

  uploadAttachment: function(conversationId, currentUserId, file) {
    return APIUtils.uploadFile('upload/attachment/' + conversationId + '/' + file.name, file);
  },

  getAnnotations: function(attachmentId) {
    return APIUtils.get('chat/annotations/' + attachmentId);
  }

};

module.exports = ChatAPI;