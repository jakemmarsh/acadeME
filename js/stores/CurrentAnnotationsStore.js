'use strict';

var Reflux      = require('reflux');

var ChatActions = require('../actions/ChatActions');
var ChatAPI     = require('../utils/ChatAPI');

var CourseRecipientsStore = Reflux.createStore({

  init: function() {
    this.annotations = null;

    this.listenTo(ChatActions.openAttachment, this.loadAnnotations);
    this.listenTo(ChatActions.saveAnnotation, this.saveAnnotation);
  },

  loadAnnotations: function(attachmentId, cb) {
    cb = cb || function() {};

    console.log('load annotations for attachment:', attachmentId);

    ChatAPI.getAnnotations(attachmentId).then(function(annotations) {
      this.annotations = annotations;
      cb(null, this.annotations);
      this.trigger(null, this.annotations);
    }.bind(this)).catch(function(err) {
      console.log('error loading annotations:', err);
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  saveAnnotation: function(annotation, attachmentId, cb) {
    cb = cb || function() {};

    console.log('save annotation:', annotation);

    ChatAPI.saveAnnotation(annotation, attachmentId).then(function(annotation) {
      this.annotations.push(annotation);
      cb(null, this.annotations);
      this.trigger(null, this.annotations);
    }.bind(this)).catch(function(err) {
      console.log('error saving annotation:', err);
      cb(err);
    });
  }

});

module.exports = CourseRecipientsStore;