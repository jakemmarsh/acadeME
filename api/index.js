'use strict';

module.exports = function(server) {

  var path          = require('path');
  var express       = require('express');
  var api           = express();
  var routes        = require(path.join(__dirname, 'routes'));
  var queue         = require('./utils/queue')();
  var setupPassport = require('./utils/passport');

  /* ====================================================== */

  require('./utils/sockets')(server, queue);

  /* ====================================================== */

  setupPassport();

  /* ====================================================== */

  // Auth endpoints
  api.post('/auth/register', routes.auth.register);
  api.get('/auth/check', routes.auth.isAuthenticated, function(req, res) {
    res.status(200).json(req.user);
  });
  api.post('/auth/login', routes.auth.login);
  api.post('/auth/logout', routes.auth.isAuthenticated, routes.auth.logout);

  /* ====================================================== */

  // User endpoints
  api.get('/user/:identifier', routes.user.get);

  /* ====================================================== */

  // Course endpoints
  api.get('/course', routes.course.getAll);
  api.get('/course/search/:query', routes.course.searchAll);
  api.get('/course/newest', routes.course.getNewest);
  api.get('/course/trending', routes.course.getTrending);
  api.get('/course/:identifier', routes.course.get);
  api.get('/course/user/:userId', routes.auth.isAuthenticated, routes.course.getForUser);
  api.post('/course', routes.auth.isAuthenticated, routes.course.create);
  api.post('/course/:id/enroll', routes.auth.isAuthenticated, routes.course.enroll);
  api.delete('/course/:id/enroll', routes.auth.isAuthenticated, routes.course.unEnroll);
  api.get('/course/:id/search/:query', routes.course.search);
  api.post('/course/:id/lesson', routes.auth.isAuthenticated, routes.course.createLesson);
  api.post('/course/:id/lesson/:lessonId/quiz', routes.quiz.create);
  api.delete('/course/:id', routes.auth.isAuthenticated, routes.course.delete);

  /* ====================================================== */

  // Lesson endpoints
  api.get('/lesson/:identifier', routes.lesson.get);
  api.get('/lesson/:id/quiz', routes.quiz.get);
  api.delete('/lesson/:id', routes.auth.isAuthenticated, routes.lesson.delete);

  /* ====================================================== */

  // Quiz endpoints
  api.post('/quiz/:quizId/begin', routes.quiz.begin);
  api.post('/quiz/:quizId/check/:questionId', routes.quiz.checkAnswer);
  api.get('/quiz/:quizId/question', routes.quiz.getQuestion);
  api.get('/quiz/suggestions', routes.quiz.suggestQuestions);
  api.post('/quiz/:quizId/question', routes.quiz.createQuestion);
  api.post('/quiz/:quizId/question/:questionId/answers', routes.quiz.createAnswers);
  api.post('/quiz/:quizId/complete/lesson/:lessonId', routes.auth.isAuthenticated, routes.quiz.markComplete);

  /* ====================================================== */

  api.post('/upload/:type/:id/:filename?', routes.auth.isAuthenticated, routes.aws.uploadFile);
  api.post('/upload/sir-trevor', routes.auth.isAuthenticated, routes.aws.uploadSirTrevorFile);

  /* ====================================================== */

  // Chat endpoints
  api.get('/chat/:courseId/recipients', routes.chat.getRecipients);
  api.get('/chat/:courseId/conversation', routes.chat.getConversation);
  api.get('/chat/annotations/:attachmentId', routes.chat.getAnnotations);
  api.post('/chat/annotations/:attachmentId', routes.chat.addAnnotation);

  /* ====================================================== */

  return api;

};