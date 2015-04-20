'use strict';

var io   = require('socket.io-client');

describe('web sockets chat system', function() {

  var socket;

  beforeEach(function() {
    socket = io('http://localhost:3000');
  });

  it('should join a chat and return the conversation object', function(done) {
    socket.emit('joinChat', {
      courseId: 1,
      userOneId: 2,
      userTwoId: 4
    }, function(conversation) {
      conversation.should.be.instanceOf(Object);
      conversation.should.have.property('UserOneId');
      conversation.should.have.property('UserTwoId');
      conversation.should.have.property('CourseId');
      done();
    });
  });

  it('should send a new message and return the queued object', function(done) {
    socket.emit('sendMessage', {
      message: {
        body: 'Body text of the message',
        ConversationId: 1,
        UserId: 2
      },
      attachment: null
    }, function(queuedMessage) {
      queuedMessage.should.be.instanceOf(Object);
      queuedMessage.should.have.property('body');
      done();
    });
  });

  it('should leave a chat', function(done) {
    socket.emit('leaveChat', done);
  });

  it('should be able to manually disconnect', function(done) {
    socket.emit('manualDisconnect', done);
  });

});