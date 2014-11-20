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

    // request.get(APIUtils.API_ROOT + 'quiz/' + quizId + '/question?' + params).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      id: 0,
      body: 'What is the capitol of Maine?',
      type: 'multi',
      answers: [
        {
          id: 1,
          body: 'Augusta'
        },
        {
          id: 2,
          body: 'Portland'
        },
        {
          id: 3,
          body: 'Brewer'
        },
        {
          id: 4,
          body: 'Bangor'
        }
      ]
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