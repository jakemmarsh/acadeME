'use strict';

var Reflux        = require('reflux');

var LessonActions = require('../actions/LessonActions');
var LessonAPI     = require('../utils/LessonAPI');

var CurrentLessonStore = Reflux.createStore({

  init: function() {
    this.listenTo(LessonActions.openLesson, this.openLesson);
  },

  openLesson: function(lessonId, cb) {
    cb = cb || function() {};

    console.log('retrieve lesson for:', lessonId);

    LessonAPI.get(lessonId).then(function(lesson) {
      this.lesson = lesson;
      this.trigger(lesson);
      cb();
    }.bind(this)).catch(function(err) {
      // TODO: handle error
      console.log('error retrieving lesson:', err);
    });
  }

});

module.exports = CurrentLessonStore;