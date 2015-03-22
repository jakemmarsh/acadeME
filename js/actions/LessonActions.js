'use strict';

var Reflux = require('reflux');

var LessonActions = Reflux.createActions([

  'openLesson',
  'openQuiz'

]);

module.exports = LessonActions;