'use strict';

module.exports = function(server) {

  var path    = require('path');
  var express = require('express');
  var api     = express();
  var routes  = require(path.join(__dirname, 'routes'));
  var queue   = require('./queue')();

  /* ====================================================== */

  require('./sockets')(server, queue);

  /* ====================================================== */

  // Auth endpoints
  api.post('/auth/register', routes.auth.register);
  api.get('/auth/check', routes.auth.isAuthenticated, function(req, res) {
    res.status(200).json(req.user);
  });
  api.post('/auth/login', routes.auth.login);

  /* ====================================================== */

  // User endpoints
  api.get('/user/:identifier', routes.user.get);

  /* ====================================================== */

  // Course endpoints
  api.get('/course', routes.course.getAll);
  api.get('/course/:identifier', routes.course.get);
  api.post('/course', routes.course.create);
  api.get('/course/:id/search/:query', routes.course.search);
  api.post('/course/:id/lesson', routes.course.createLesson);
  api.delete('/course/:id', routes.course.delete);

  /* ====================================================== */

  // Lesson endpoints
  api.get('/lesson/:identifier', routes.lesson.get);
  api.get('/lesson/:id/quiz', routes.quiz.get);
  api.delete('/lesson/:id', routes.lesson.delete);

  /* ====================================================== */

  // Quiz endpoints
  api.post('/quiz/:quizId/check/:questionId', routes.quiz.checkAnswer);
  api.get('/quiz/:quizId/question', routes.quiz.getQuestion);

  /* ====================================================== */

  api.post('/upload/:type/:id', routes.aws.uploadImage);

  /* ====================================================== */

  // Chat endpoints
  api.get('/chat/:courseId/recipients', routes.chat.getRecipients);
  api.get('/chat/:courseId/conversation', routes.chat.getConversation); // TODO: figure out what other params this needs

  /* ====================================================== */

  return api;

};