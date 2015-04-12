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
      description: quiz.description || quiz.Description,
      tags: (typeof quiz.tags === 'string') ? quiz.tags.split(',') : quiz.tags,
      numQuestions: quiz.numQuestions || quiz.NumQuestions
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
      difficulty: question.difficulty || question.Difficulty,
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

  // TODO: are answers saved for the wrong question?
  saveAnswers(req.params.quizId, req.params.questionId, req.body).then(function() {
    res.status(200).json({ status: 200, message: 'Answers successfully saved for question: ' + req.params.questionId });
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.get = function(req, res) {

  var getQuiz = function(lessonId) {
    var deferred = when.defer();

    models.Lesson.find({
      where: { id: lessonId },
      include: [
        {
          model: models.Quiz,
          include: [{
            model: models.Question,
            attributes: ['id']
          }]
        }
      ]
    }).then(function(lesson) {
      lesson = lesson.toJSON();

      if ( _.isEmpty(lesson.Quiz) ) {
        deferred.reject({ status: 404, body: 'Quiz could not be found for lessonId: ' + lessonId });
      } else {
        deferred.resolve(_.assign({ lessonTitle: lesson.title }, lesson.Quiz));
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

exports.begin = function(req, res) {

  var setQuiz = function(quizId) {
    var deferred = when.defer();

    models.Quiz.find({
      where: { id: quizId }
    }).then(function(quiz) {
      req.session.quiz = quiz.toJSON();
      deferred.resolve(quiz);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  setQuiz(req.params.quizId).then(function() {
    req.session.save();
    res.status(200).json({ quiz: req.session.quiz });
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.getQuestion = function(req, res) {

  var getQuestion = function(quizId) {
    var deferred = when.defer();
    var currentQuestionNumber;
    var userScore;

    if ( !_.isEmpty(req.session.quiz) ) {
      userScore = req.session.quiz.score;

      if ( _.isNumber(req.session.quiz.currentQuestionNumber) ) {
        currentQuestionNumber = req.session.quiz.currentQuestionNumber + 1;
      } else {
        currentQuestionNumber = 1;
      }

      // Create an array of previously answered questions (if not already created)
      if ( !(req.session.quiz.answeredQuestions instanceof Array) ) {
        req.session.quiz.answeredQuestions = [];
      }

      // Store current question before retrieving and updating
      if ( req.session.quiz.currentQuestion ) {
        req.session.quiz.answeredQuestions.push(req.session.quiz.currentQuestion);
      }

      // TODO: complete logic for getting next question
      models.Question.find({
        where: { QuizId: quizId },
        include: [models.Answer]
      }).then(function(question) {
        req.session.quiz.currentQuestion = question;
        req.session.quiz.currentQuestionNumber = currentQuestionNumber;
        deferred.resolve(question);
      }).catch(function(err) {
        deferred.reject({ status: 500, body: err });
      });
    } else {
      deferred.reject({ status: 400, body: 'No quiz currently in progress.' });
    }

    return deferred.promise;
  };

  getQuestion(req.params.quizId).then(function(question) {
    req.session.save();
    res.status(200).json(question);
  }).catch(function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.checkAnswer = function(req, res) {

  var answerMatches = function(userAnswer, questionAnswers) {
    return !!_.filter(questionAnswers, function(possibleAnswer) {
      return userAnswer.trim().toLowerCase() === possibleAnswer.body.trim().toLowerCase();
    }).length;
  };

  var doCheck = function(quizId, questionId, userAnswer) {
    var deferred = when.defer();

    if ( !_.isEmpty(req.session.quiz) ) {
      models.Answer.findAll({
        where: {
          QuestionId: questionId,
          isCorrect: true
        }
      }).then(function(answers) {
        if ( answerMatches(userAnswer, answers) ) {
          req.session.quiz.score = _.isNumber(req.session.quiz.score) ? req.session.quiz.score + 1 : 1; // TODO: more complex logic
          deferred.resolve(true);
        } else {
          req.session.quiz.score = _.isNumber(req.session.quiz.score) ? req.session.quiz.score - 1 : -1; // TODO: more complex logic
          deferred.resolve(false);
        }
      }).catch(function(err) {
        deferred.reject({ status: 500, body: err });
      });
    } else {
      deferred.reject({ status: 400, body: 'No quiz currently in progress.' });
    }

    return deferred.promise;
  };

  doCheck(req.params.quizId, req.params.questionId, req.body.answer).then(function(result) {
    req.session.save();
    res.status(200).json({ isCorrect: result, score: req.session.quiz.score });
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

    if ( !_.isEmpty(req.session.quiz) ) {
      models.QuizCompletion.findOrCreate({
        where: completion,
        defaults: completion
      }).then(function() {
        req.session.quiz = null;
        deferred.resolve();
      }).catch(function(err) {
        console.log('error marking complete:', err);
        deferred.reject({ status: 500, body: err });
      });
    } else {
      deferred.reject({ status: 400, body: 'No quiz currently in progress.' });
    }

    return deferred.promise;
  };

  createCompletion(req.user.id, req.params.lessonId, req.params.quizId).then(function() {
    req.session.save();
    res.status(200).json({ status: 200, message: 'Quiz successfully marked as complete.' });
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};