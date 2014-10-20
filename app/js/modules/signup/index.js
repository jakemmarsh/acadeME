'use strict';

require('./controllers/_index');
require('./services/_index');
require('./directives/_index');

var angular = require('angular');
var requires = [
  'App.Signup.controllers',
  'App.Signup.services',
  'App.Signup.directives'
];

module.exports = angular.module('App.Signup', requires);