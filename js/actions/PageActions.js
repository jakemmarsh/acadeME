'use strict';

var Reflux = require('reflux');

var PageActions = Reflux.createActions([

  'openCurriculum',
  'openExplore',
  'searchAllCourses',
  'openCourse'

]);

module.exports = PageActions;