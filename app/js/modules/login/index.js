'use strict';

require('./controllers/_index');
require('./services/_index');
require('./directives/_index');

var angular = require('angular');
var requires = [
  'App.Login.controllers',
  'App.Login.services',
  'App.Login.directives'
];

module.exports = angular.module('App.Login', requires);