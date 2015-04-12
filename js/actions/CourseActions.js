'use strict';

var Reflux = require('reflux');

var CourseActions = Reflux.createActions([

  'loadAll',
  'openCourse',
  'setCourse',
  'openLessons',
  'search',
  'openChat',
  'createLesson',
  'enroll',
  'unEnroll'

]);

module.exports = CourseActions;