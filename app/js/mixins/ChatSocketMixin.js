'use strict';

var io = require('socket.io-client');

var ChatSocketMixin = {

  socket: null,

  getInitialState: function() {
    return {
      newMessages: []
    };
  },

  componentWillUnmount: function() {
    this.socket.emit('manualDisconnect');
    this.socket = null;
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
    cb = cb || function() {};

    this.openSocket();

    this.socket.emit('joinChat', {
      courseId: courseId,
      currentUserId: currentUserId,
      recipientId: recipientId
    }, cb);
  },

  sendMessage: function(message, conversation, currentUser, cb) {
    cb = cb || function() {};

    this.socket.emit('sendMessage', {
      body: message,
      conversationId: conversation.id,
      userId: currentUser.id
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