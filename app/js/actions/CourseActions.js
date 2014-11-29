'use strict';

var Reflux = require('reflux');

var CourseActions = Reflux.createActions([

  'openCourse',
  'openLessons',
  'openChat',
  'createLesson'

]);

module.exports = CourseActions;