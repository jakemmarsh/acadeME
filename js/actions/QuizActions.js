'use strict';

var Reflux = require('reflux');

var QuizActions = Reflux.createActions([

  'begin',
  'getQuestion',
  'checkAnswer',
  'markComplete'

]);

module.exports = QuizActions;