'use strict';

var Reflux = require('reflux');

var ChatActions = Reflux.createActions([

  'openConversation',
  'openAttachment',
  'saveAnnotation'

]);

module.exports = ChatActions;