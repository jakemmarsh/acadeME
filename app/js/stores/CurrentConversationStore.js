'use strict';

var Reflux           = require('reflux');

var ChatActions      = require('../actions/ChatActions');
var CurrentUserStore = require('../stores/CurrentUserStore');

var CurrentConversationStore = Reflux.createStore({

  init: function() {
    this.conversation = null;

    this.listenTo(ChatActions.openConversation, this.openConversation);
    this.listenTo(ChatActions.sendMessage, this.sendMessage);
  },

  openConversation: function(courseId, recipientId) {
    var conversation = {
      recipient: {
        id: recipientId
      },
      messages: []
    };

    console.log('open conversation with course:', courseId, 'recipient:', recipientId);

    this.conversation = conversation;

    // TODO: load entire conversation from database using courseId, currentUser, and recipientId

    this.trigger(null, this.conversation);
  },

  sendMessage: function() {
    console.log('send message');
  }

});

module.exports = CurrentConversationStore;