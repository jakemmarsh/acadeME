'use strict';

var Reflux      = require('reflux');

var ChatActions = require('../actions/ChatActions');
var ChatAPI     = require('../utils/ChatAPI');

var CourseRecipientsStore = Reflux.createStore({

  init: function() {
    this.annotations = null;

    this.listenTo(ChatActions.openAttachment, this.loadAnnotations);
  },

  loadAnnotations: function(attachmentId, cb) {
    cb = cb || function() {};

    console.log('load annotations for attachment:', attachmentId);

    ChatAPI.getAnnotations(attachmentId).then(function(annotations) {
      this.annotations = annotations;
      cb(null, this.annotations);
      this.trigger(null, this.annotations);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  }
});

module.exports = CourseRecipientsStore;