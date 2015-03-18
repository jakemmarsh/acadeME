'use strict';

var when      = require('when');
var _         = require('lodash');
var Sequelize = require('sequelize');
var models    = require('../models');

/* ====================================================== */

exports.create = function(req, res) {

  var createQuiz = function(quiz, courseId, lessonId) {
    var deferred = when.defer();
    var newQuiz = {
      LessonId: lessonId,
      CourseId: courseId,
      body: quiz.body || quiz.Body,
      type: quiz.type || quiz.Type
    };

    models.Quiz.create(newQuiz).then(function(createdQuiz) {
      deferred.resolve(createdQuiz);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  createQuiz(req.body, req.params.id, req.params.lessonId).then(function(quiz) {
    res.status(200).json(quiz);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.suggestQuestions = function(req, res) {

  var getSuggestedQuestions = function(tags) {
    var deferred = when.defer();

    tags = _.map(tags.split(','), function(tag) { return tag.toLowerCase(); });

    models.Quiz.findAll({
      where: Sequelize.or(
        { tags: { $contains: tags }}
      ),
      include: [
        {
          model: models.Question,
          include: [models.Answer]
        }
      ]
    }).then(function(similarQuizzes) {
      var suggestedQuestions = [];

      _.forEach(similarQuizzes, function(quiz) {
        suggestedQuestions = suggestedQuestions.concat(quiz.Questions);
      });

      deferred.resolve(suggestedQuestions);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };


  getSuggestedQuestions(req.query.tags).then(function(questions) {
    res.status(200).json(questions);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.createQuestion = function(req, res) {

  var saveQuestion = function(quizId, question) {
    var deferred = when.defer();

    question = {
      QuizId: quizId,
      body: question.body || question.Body
    };

    models.Question.create(question).then(function(createdQuestion) {
      deferred.resolve(createdQuestion);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  saveQuestion(req.params.quizId, req.body).then(function(question) {
    res.status(200).json(question);
  }).catch(function(err) {
    console.log('error creating question:', err.body);
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.createAnswers = function(req, res) {

  var saveAnswers = function(quizId, questionId, answers) {
    var deferred = when.defer();

    console.log('answers before:', answers);

    answers = _.map(answers, function(answer) {
      return {
        QuestionId: questionId,
        body: answer.body || answer.Body
      };
    });

    console.log('about to save:', answers);

    models.Answer.bulkCreate(answers).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  saveAnswers(req.params.quizId, req.params.questionId, req.body).then(function() {
    console.log('did save');
    res.status(200).json({ status: 200, message: 'Answers successfully saved for question: ' + req.params.quizId });
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.get = function(req, res) {

  var getQuiz = function(lessonId) {
    var deferred = when.defer();

    models.Quiz.find({
      where: { LessonId: lessonId },
      include: [
        {
          model: models.Question,
          attributes: ['id']
        }
      ]
    }).then(function(quiz) {
      if ( _.isEmpty(quiz) ) {
        deferred.reject({ status: 404, body: 'Quiz could not be found for lessonId: ' + lessonId });
      } else {
        deferred.resolve(quiz);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getQuiz(req.params.id).then(function(quiz) {
    res.status(200).json(quiz);
  }, function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.getQuestion = function(req, res) {

  var getQuestion = function(quizId, currentQuestionNumber, userScore) {
    var deferred = when.defer();

    // TODO: complete logic for getting next question
    models.Question.find({
      where: { QuizId: quizId },
      include: [models.Answer]
    }).then(function(question) {
      deferred.resolve(question);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getQuestion(req.params.quizId, req.query.current, req.query.score).then(function(question) {
    res.status(200).json(question);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
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
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  doCheck(req.params.quizId, req.params.questionId, req.body.answer).then(function(isCorrect) {
    res.status(200).json({ isCorrect: isCorrect });
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.markComplete = function(req, res) {

  var createCompletion = function(userId, lessonId, quizId) {
    var deferred = when.defer();
    var completion = {
      UserId: userId,
      LessonId: lessonId,
      QuizId: quizId
    };

    models.QuizCompletion.create(completion).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  createCompletion(req.user.id, req.params.lessonId, req.params.quizId).then(function() {
    res.status(200).json({ status: 200, message: 'Quiz successfully marked as complete.' });
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};