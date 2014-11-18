'use strict';

var when   = require('when');
var _      = require('underscore');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getQuiz = function(lessonId) {
    var deferred = when.defer();

    models.Quiz.find({
      where: { LessonId: lessonId },
      include: [
        {
          model: models.Question,
          include: [models.Answer]
        }
      ]
    }).then(function(quiz) {
      if ( _.isEmpty(quiz) ) {
        deferred.reject({
          status: 404,
          body: 'Quiz could not be found for lessonId: ' + lessonId
        });
      } else {
        deferred.resolve(quiz);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  getQuiz(req.params.lessonId).then(function(quiz) {
    res.status(200).json(quiz);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.getQuestion = function(req, res) {

  var getQuestion = function(quizId, currentQuestionNumber, userScore) {
    var deferred = when.defer();

    // TODO: complete logic for getting next question
    models.Question.find({
      where: { QuizId: quizId }
    }).then(function(question) {
      deferred.resolve(question);
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  getQuestion(req.params.quizId, req.query.current, req.query.score).then(function(question) {
    res.status(200).json(question);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.checkAnswer = function(req, res) {

  var answerMatches = function(userAnswer, questionAnswers) {
    return !!_.filter(questionAnswers, function(possibleAnswer) {
      return userAnswer.trim().toLowerCase() === possibleAnswer.trim().toLowerCase();
    }).length;
  };

  var doCheck = function(quizId, questionId, userAnswer) {
    var deferred = when.defer();

    models.Answer.findAll({
      where: { QuizId: quizId }
    }).then(function(answers) {
      if ( answerMatches(userAnswer, answers) ) {
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  doCheck(req.params.quizId, req.params.questionId, req.body.answer).then(function(isCorrect) {
    res.status(200).json({
      isCorrect: isCorrect
    });
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};