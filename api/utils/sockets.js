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

      chatUtils.upsertConversation(data.courseId, data.userOneId, data.userTwoId).then(function(conversation) {
        socket.conversationId = conversation.id;
        socket.join(socket.room);
        cb(conversation);
      });
    });

    /* ====================================================== */

    socket.on('sendMessage', function(data, cb) {
      var message = {
        body: data.message.body || data.message.Body || '',
        ConversationId: data.message.conversationId || data.message.ConversationId,
        UserId: data.message.userId || data.message.UserId
      };

      cb = cb || function() {};

      console.log('receive message:', data);

      queue.message(message, data.attachment || null).then(function(queuedMessage) {
        queuedMessage.attachment = data.attachment || null;
        console.log('message returned after creating job:', humps.camelizeKeys(queuedMessage));
        io.sockets.in(socket.room).emit('updateChat', humps.camelizeKeys(queuedMessage));
        cb(queuedMessage);
      });
    });

    /* ====================================================== */

    socket.on('leaveChat', function(cb) {
      cb = cb || function() {};

      console.log('leave');

      socket.leave(socket.room);
      socket.conversationId = null;
      socket.room = null;

      cb();
    });

    /* ====================================================== */

    socket.on('manualDisconnect', function(cb) {
      cb = cb || function() {};

      console.log('manual disconnect');

      if ( socket.room ) {
        socket.leave(socket.room);
      }

      cb();

      socket.disconnect();
    });

  });

};