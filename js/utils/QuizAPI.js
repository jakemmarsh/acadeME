'use strict';

var qs       = require('querystring');

var APIUtils = require('./APIUtils');

var QuizAPI = {

  getQuestionSuggestions: function(tags) {
    var query = {
      tags: tags.join(',')
    };

    return APIUtils.get('quiz/suggestions?' + qs.stringify(query));
  },

  saveQuestion: function(quizId, question) {
    return APIUtils.post('quiz/' + quizId + '/question', question);
  },

  saveAnswers: function(quizId, questionId, answers) {
    return APIUtils.post('quiz/' + quizId + '/question/' + questionId + '/answers', answers);
  },

  markStarted: function(quizId) {
    return APIUtils.post('quiz/' + quizId + '/begin');
  },

  getQuestion: function(quizId) {
    return APIUtils.get('quiz/' + quizId + '/question');
  },

  checkAnswer: function(quizId, questionId, answer) {
    return APIUtils.post('quiz/'+ quizId + '/check/' + questionId, answer);
  },

  markComplete: function(lessonId, quizId) {
    return APIUtils.post('quiz/' + quizId + '/complete/' + 'lesson/' + lessonId);
  }

};

module.exports = QuizAPI;