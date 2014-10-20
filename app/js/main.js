'use strict';

var angular = require('angular');

// angular modules
require('angular-ui-router');
require('./templates');
require('./modules/signup');
require('./modules/login');
require('./modules/course');

// create and bootstrap application
angular.element(document).ready(function() {

  var requires = [
    'ui.router',
    'templates',
    'App.Login',
    'App.Course'
  ];

  // mount on window for testing
  window.app = angular.module('App', requires);

  angular.module('App').constant('AppSettings', require('./constants'));

  angular.module('App').config(require('./routes'));

  angular.module('App').run(require('./on_run'));

  angular.bootstrap(document, ['App']);

});