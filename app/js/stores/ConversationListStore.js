'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');

var ConversationListStore = Reflux.createStore({

  init: function() {
    this.listenTo(CourseActions.openConversations, this.loadMessagesFor);
  },

  loadMessagesFor: function(courseId) {
    var conversations = [
      { recipient: 'Bill Gates' },
      { recipient: 'Steve Jobs' }
    ];

    console.log('load conversations for course:', courseId);

    this.currentList = conversations;

    // TODO: load messages from database for courseId

    this.trigger(conversations);
  }

});

module.exports = ConversationListStore;