'use strict';

var Reflux = require('reflux');

var QuizActions = Reflux.createActions([

  'getQuestion',
  'checkAnswer'

]);

module.exports = QuizActions;