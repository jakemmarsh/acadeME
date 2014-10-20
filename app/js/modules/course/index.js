'use strict';

require('./controllers/_index');
require('./services/_index');
require('./directives/_index');

var angular = require('angular');
var requires = [
  'App.Course.controllers',
  'App.Course.services',
  'App.Course.directives'
];

module.exports = angular.module('App.Course', requires);