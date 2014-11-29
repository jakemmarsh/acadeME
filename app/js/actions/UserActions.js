'use strict';

var Reflux = require('reflux');

var UserActions = Reflux.createActions([

  'check',
  'login',
  'logout'

]);

module.exports = UserActions;