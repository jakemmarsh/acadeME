'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', ['clean'], function(callback) {

  callback = callback || function() {};

  global.isProd = true;

  return runSequence(['sass', 'imagemin', 'browserify', 'fonts', 'copyIndex', 'copyIcons'], callback);

});