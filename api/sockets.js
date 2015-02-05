'use strict';

var humps     = require('humps');
var chatUtils = require('./utils/chat');

/* ====================================================== */

module.exports = function(server, queue) {

  var io = require('socket.io').listen(server);

  var buildRoomString = function(data) {
    return data.courseId.toString() + '-' + data.userOneId.toString() + '-' + data.userTwoId.toString();
  };

  /* ====================================================== */

  io.on('connection', function(socket) {

    socket.room = null;
    console.log('a user connected!');

    /* ====================================================== */

    socket.on('joinChat', function(data, cb) {
      socket.room = buildRoomString(data);

      cb = cb || function() {};

      console.log('join:', socket.room);

      // TODO: create conversation if it doesn't exist?
      chatUtils.upsertConversation(data.courseId, data.userOneId, data.userTwoId).then(function(conversation) {
        socket.conversationId = conversation.id;
        socket.join(socket.room);
        cb(conversation);
      });
    });

    /* ====================================================== */

    socket.on('sendMessage', function(data, cb) {
      var message = {
        body: data.body || data.Body || '',
        attachment: data.attachment || data.Attachment,
        ConversationId: data.conversationId || data.ConversationId,
        UserId: data.userId || data.UserId
      };

      cb = cb || function() {};

      console.log('receive message:', data);

      queue.message(message).then(function(queuedMessage) {
        console.log('message returned after creating job:', humps.camelizeKeys(queuedMessage));
        io.sockets.in(socket.room).emit('updateChat', humps.camelizeKeys(queuedMessage));
        cb(queuedMessage);
      });
    });

    /* ====================================================== */

    socket.on('leaveChat', function() {
      console.log('leave');
      socket.leave(socket.room);
      socket.conversationId = null;
      socket.room = null;
    });

    /* ====================================================== */

    socket.on('manualDisconnect', function() {
      console.log('manual disconnect');
      socket.leave(socket.room);
      socket.disconnect();
    });

  });

};