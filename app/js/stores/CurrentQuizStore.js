'use strict';

var Reflux        = require('reflux');
var LessonActions = require('../actions/LessonActions');

var CurrentQuizStore = Reflux.createStore({

  init: function() {
    this.listenTo(LessonActions.openQuiz, this.loadQuizFor);
  },

  loadQuizFor: function(lessonId) {
    var quiz = {
      title: 'Test Quiz'
    };

    console.log('retrieve quiz for lesson:', lessonId);

    this.currentQuiz = quiz;

    // fetch quiz from database

    this.trigger(quiz);
  }

});

module.exports = CurrentQuizStore;