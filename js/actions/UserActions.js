'use strict';

var Reflux = require('reflux');

var UserActions = Reflux.createActions([

  'check',
  'set',
  'login',
  'logout'

]);

module.exports = UserActions;