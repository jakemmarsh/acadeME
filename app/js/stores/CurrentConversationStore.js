'use strict';

var Reflux              = require('reflux');
var ConversationActions = require('../actions/ConversationActions');

var CurrentConversationStore = Reflux.createStore({

  init: function() {
    this.listenTo(ConversationActions.openConversation, this.openConversation);
  },

  openConversation: function(conversationId) {
    var conversation;

    console.log('open conversation with id:', conversationId);

    this.currentConversation = conversation;

    // TODO: load entire conversation from database using conversationId

    this.trigger(conversation);
  }

});

module.exports = CurrentConversationStore;