'use strict';

var gulp        = require('gulp');
var shell       = require('gulp-shell');
var runSequence = require('run-sequence');

gulp.task('dev', ['clean'], function() {

  var startServer = function() {
    return gulp.src('')
      .pipe(shell('npm start'));
  };

  global.isProd = false;

  return runSequence(['sass', 'imagemin', 'browserify', 'fonts', 'copyIndex', 'copyIcons'], 'watch', startServer);

});