'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');

var CourseRecipientsStore = Reflux.createStore({

  init: function() {
    this.recipients = null;

    this.listenTo(CourseActions.openChat, this.loadRecipients);
  },

  loadRecipients: function(courseId) {
    var recipients = [
      {
        id: 0,
        name: 'Steve Jobs'
      },
      {
        id: 1,
        name: 'Bill Gates'
      }
    ];

    console.log('load recipients for course:', courseId);

    this.recipients = recipients;

    // TODO: load classmates/teacher from database for courseId

    this.trigger(null, this.recipients);
  }

});

module.exports = CourseRecipientsStore;