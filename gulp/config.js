'use strict';

module.exports = {

  'scripts': {
    'src': './js/**/*.{js,jsx}',
    'dest': './build/js/'
  },

  'images': {
    'src': './public/images/**/*.{jpeg,jpg,png,svg,gif}',
    'dest': './build/images/'
  },

  'styles': {
    'src': './public/styles/**/*.scss',
    'dest': './build/css/'
  },

  'fonts': {
    'src': './public/fonts/**/*',
    'dest': './build/fonts/'
  },

  'tests': './js/__tests__/**/*.{js,jsx}',

  'sourceDir': './public/',

  'buildDir': './build/'

};