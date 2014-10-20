'use strict';

require('./controllers/_index');
require('./services/_index');
require('./directives/_index');

var angular = require('angular');
var requires = [
  'App.Chat.controllers',
  'App.Chat.services',
  'App.Chat.directives'
];

module.exports = angular.module('App.Chat', requires);