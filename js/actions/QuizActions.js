'use strict';

var Reflux = require('reflux');

var QuizActions = Reflux.createActions([

  'getQuestion',
  'checkAnswer',
  'markComplete'

]);

module.exports = QuizActions;