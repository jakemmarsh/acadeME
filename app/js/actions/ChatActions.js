'use strict';

var Reflux = require('reflux');

var ChatActions = Reflux.createActions([

  'openConversation',
  'sendMessage'

]);

module.exports = ChatActions;