'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var ChatAPI = {

  getCourseRecipients: function(userId, courseId) {
    var deferred = when.defer();

    deferred.resolve([
      {
        id: 2,
        name: 'Steve Jobs',
        imageUrl: 'http://a5.files.biography.com/image/upload/c_fill,dpr_1.0,g_face,h_300,q_80,w_300/MTE5NDg0MDU0NTIzODQwMDE1.jpg'
      },
      {
        id: 3,
        name: 'Bill Gates',
        imageUrl: 'http://timedotcom.files.wordpress.com/2014/01/bill-gates.jpg?w=1100'
      }
    ]);

    return deferred.promise;
  },

  getConversation: function(currentUserId, courseId, recipientId) {
    var deferred = when.defer();

    deferred.resolve({
      id: 1,
      recipient: {
        id: recipientId
      },
      messages: [
        {
          user: {
            id: recipientId,
            imageUrl: recipientId === 2 ? 'http://a5.files.biography.com/image/upload/c_fill,dpr_1.0,g_face,h_300,q_80,w_300/MTE5NDg0MDU0NTIzODQwMDE1.jpg' : 'http://timedotcom.files.wordpress.com/2014/01/bill-gates.jpg?w=1100'
          },
          body: 'This is a message from the other person!'
        },
        {
          user: {
            id: currentUserId
          },
          body: 'This is a message sent by the current user!'
        }
      ]
    });

    return deferred.promise;
  },

  sendMessage: function() {
    var deferred = when.defer();

    return deferred.promise;
  }

};

module.exports = ChatAPI;