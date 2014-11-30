'use strict';

module.exports = function(server) {

  var path    = require('path');
  var express = require('express');
  var api     = express();
  var routes  = require(path.join(__dirname, 'routes'));

  /* ====================================================== */

  require('./sockets')(server, routes);

  /* ====================================================== */

  // Auth endpoints
  api.put('/register', routes.auth.register);
  api.post('/login', routes.auth.login);

  /* ====================================================== */

  // User endpoints
  api.get('/user/:identifier', routes.user.get);

  /* ====================================================== */

  // Course endpoints
  api.get('/course/:identifier', routes.course.get);
  api.get('/course/:id/search/:query', routes.course.search);
  api.put('/course/:id/lesson', routes.course.createLesson);
  api.delete('/course/:id', routes.course.delete);

  /* ====================================================== */

  // Lesson endpoints
  api.get('/lesson/:identifier', routes.lesson.get);
  api.get('/lesson/:lessonId/quiz', routes.quiz.get);
  api.delete('/lesson/:id', routes.lesson.delete);

  /* ====================================================== */

  // Quiz endpoints
  api.post('quiz/:quizId/check/:questionId', routes.quiz.checkAnswer);
  api.get('quiz/:quizId/question', routes.quiz.getQuestion);

  /* ====================================================== */

  return api;

};