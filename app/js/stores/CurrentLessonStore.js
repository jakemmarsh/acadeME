'use strict';

var Reflux        = require('reflux');

var LessonActions = require('../actions/LessonActions');

var CurrentLessonStore = Reflux.createStore({

  init: function() {
    this.listenTo(LessonActions.openLesson, this.openLesson);
  },

  // TODO: does this receive a full lesson, or just a lesson ID?
  openLesson: function(lessonId) {
    var lesson;

    console.log('retrieve lesson for:', lessonId);

    lesson = {
      id: 1,
      title: 'Heuristic Evaluation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
      image_url: ''
    };

    this.trigger(lesson);
  }

});

module.exports = CurrentLessonStore;