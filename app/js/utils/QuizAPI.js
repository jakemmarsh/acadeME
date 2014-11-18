'use strict';

var when     = require('when');
var request  = require('superagent');
var qs       = require('querystring');

var APIUtils = require('./APIUtils');

var QuizAPI = {

  getQuestion: function(quizId, currentQuestionNumber, userScore) {
    var deferred = when.defer();
    var params = qs.stringify({
      current: currentQuestionNumber,
      score: userScore
    });

    request.get(APIUtils.API_ROOT + 'quiz/' + quizId + '/question?' + params).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  checkAnswer: function(quizId, questionId, answer) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'quiz/' + quizId + '/check/' + questionId, answer).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = QuizAPI;