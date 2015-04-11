'use strict';

var gulp   = require('gulp');
var jest   = require('gulp-jest'); // jshint ignore:line
var config = require('../config');

gulp.task('test', function() {

  return gulp.src(config.tests).pipe(jest({
    scriptPreprocessor: './preprocessor.js',
    testDirectoryName: '/js/__tests__',
    testFileExtensions: [
      'js'
    ]
  }));

});