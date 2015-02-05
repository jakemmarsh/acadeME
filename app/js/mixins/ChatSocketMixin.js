'use strict';

var when = require('when');
var io   = require('socket.io-client');

var ChatSocketMixin = {

  socket: null,

  getInitialState: function() {
    return {
      newMessages: []
    };
  },

  clearNewMessages: function() {
    this.setState({ newMessages: [] });
  },

  addNewMessage: function(message) {
    var newMessagesCopy = this.state.newMessages;

    console.log('add new:', message.body);

    newMessagesCopy.push(message);

    this.setState({ newMessages: newMessagesCopy });
  },

  openSocket: function() {
    if ( !this.socket ) {
      this.socket = io('http://localhost:3000');

      this.socket.on('updateChat', function(message) {
        console.log('update chat:', message);
        this.addNewMessage(message);
      }.bind(this));
    }
  },

  joinChat: function(courseId, currentUserId, recipientId, cb) {
    var deferred = when.defer();
    var sortedIds = [currentUserId, recipientId].sort();

    cb = cb || function() {};

    this.openSocket();

    this.leaveChat(function() {
      this.socket.emit('joinChat', {
        courseId: courseId,
        userOneId: sortedIds[0],
        userTwoId: sortedIds[1]
      }, deferred.resolve);
    }.bind(this));

    return deferred.promise;
  },

  sendMessage: function(message, conversationId, currentUserId, attachment, cb) {
    cb = cb || function() {};

    console.log('send message:', message);

    this.socket.emit('sendMessage', {
      body: message || '',
      attachment: attachment,
      ConversationId: conversationId,
      UserId: currentUserId
    }, cb);
  },

  leaveChat: function(cb) {
    cb = cb || function() {};

    if ( this.socket ) {
      this.socket.emit('leaveChat');
      this.clearNewMessages();
    }

    cb();
  }

};

module.exports = ChatSocketMixin;