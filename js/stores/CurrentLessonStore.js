'use strict';

var Reflux        = require('reflux');

var LessonActions = require('../actions/LessonActions');
var LessonAPI     = require('../utils/LessonAPI');

var CurrentLessonStore = Reflux.createStore({

  init: function() {
    this.lesson = null;

    this.listenTo(LessonActions.openLesson, this.openLesson);
  },

  openLesson: function(lessonId, cb) {
    cb = cb || function() {};

    console.log('retrieve lesson for:', lessonId);

    LessonAPI.get(lessonId).then(function(lesson) {
      this.lesson = lesson;
      cb(null, this.lesson);
      this.trigger(null, this.lesson);
    }.bind(this)).catch(function(err) {
      this.lesson = null;
      cb(err);
      console.log('error retrieving lesson:', err);
    }.bind(this));
  }

});

module.exports = CurrentLessonStore;