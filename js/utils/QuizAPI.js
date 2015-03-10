'use strict';

var qs       = require('querystring');

var APIUtils = require('./APIUtils');

var QuizAPI = {

  getQuestion: function(quizId, currentQuestionNumber, userScore) {
    var params = qs.stringify({
      current: currentQuestionNumber,
      score: userScore
    });

    return APIUtils.get('quiz/' + quizId + '/question?' + params);

    // deferred.resolve({
    //   id: 0,
    //   body: 'What is the capitol of Maine?',
    //   type: 'multi',
    //   answers: [
    //     {
    //       id: 1,
    //       body: 'Augusta'
    //     },
    //     {
    //       id: 2,
    //       body: 'Portland'
    //     },
    //     {
    //       id: 3,
    //       body: 'Brewer'
    //     },
    //     {
    //       id: 4,
    //       body: 'Bangor'
    //     }
    //   ]
    // });
  },

  checkAnswer: function(quizId, questionId, answer) {
    return APIUtils.post('quiz/'+ quizId + '/check/' + questionId, answer);

    // deferred.resolve(true);
  }

};

module.exports = QuizAPI;