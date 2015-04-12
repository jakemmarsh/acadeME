'use strict';

var Reflux        = require('reflux');
var LessonActions = require('../actions/LessonActions');
var QuizActions   = require('../actions/QuizActions');
var LessonAPI     = require('../utils/LessonAPI');
var QuizAPI       = require('../utils/QuizAPI');

var CurrentQuizStore = Reflux.createStore({

  init: function() {
    this.listenTo(LessonActions.openQuiz, this.loadQuizFor);
    this.listenTo(QuizActions.begin, this.beginQuiz);
    this.listenTo(QuizActions.getQuestion, this.loadQuestion);
    this.listenTo(QuizActions.checkAnswer, this.checkAnswer);
    this.listenTo(QuizActions.markComplete, this.markComplete);
  },

  loadQuizFor: function(lessonId, cb) {
    cb = cb || function() {};

    console.log('loading quiz for lesson:', lessonId);

    LessonAPI.getQuiz(lessonId).then(function(quiz) {
      this.quiz = quiz;
      cb(null, this.quiz);
      this.trigger(null, this.quiz);
    }.bind(this)).catch(function(err) {
      cb(err);
      console.log('error getting quiz:', err);
    }.bind(this));
  },

  beginQuiz: function(quizId, cb) {
    cb = cb || function() {};

    console.log('begin quiz:', quizId);

    QuizAPI.markStarted(quizId).then(function(res) {
      this.quiz = res.quiz;
      cb();
    }.bind(this));
  },

  loadQuestion: function(quizId, cb) {
    cb = cb || function() {};

    console.log('load question for quiz:', quizId);

    QuizAPI.getQuestion(quizId).then(function(question) {
      cb(null, question);
    }.bind(this)).catch(function(err) {
      cb(err);
      console.log('error getting question:', err);
    }.bind(this));
  },

  checkAnswer: function(questionId, answer, cb) {
    cb = cb || function() {};

    console.log('checking answer for question:', questionId);

    QuizAPI.checkAnswer(this.quiz.id, questionId, answer).then(function(result) {
      cb(null, result);
    }.bind(this)).catch(function(err) {
      cb(err);
      console.log('error checking answer:', err);
    }.bind(this));
  },

  markComplete: function(lessonId, quizId, cb) {
    cb = cb || function() {};

    console.log('mark quiz complete:', quizId);

    QuizAPI.markComplete(lessonId, quizId).then(function(result) {
      cb(null, result);
    }.bind(this)).catch(function(err) {
      cb(err);
      console.log('error marking complete:', err);
    }.bind(this));
  }

});

module.exports = CurrentQuizStore;