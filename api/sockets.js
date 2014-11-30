'use strict';

module.exports = function(server, routes) {

  var io = require('socket.io').listen(server);

  var buildRoomString = function(data) {
    var sortedUserIds = [data.currentUserId, data.recipientId].sort();

    return data.courseId.toString() + '-' + sortedUserIds[0].toString() + '-' + sortedUserIds[1].toString();
  };

  io.on('connection', function(socket) {

    socket.room = null;
    console.log('a user connected!');

    socket.on('joinChat', function(data, cb) {
      socket.room = buildRoomString(data);

      cb = cb || function() {};

      console.log('join:', socket.room);

      // TODO: create conversation if it doesn't exist?

      socket.join(socket.room);

      cb();
    });

    socket.on('sendMessage', function(data, cb) {
      cb = cb || function() {};

      console.log('sendMessage:', data);
      console.log('in room:', io.sockets.in(socket.room));

      // TODO: save message in database
      io.sockets.in(socket.room).emit('updateChat', {
        user: {
          id: data.userId
        },
        body: data.body
      });

      cb();
    });

    socket.on('leaveChat', function() {
      console.log('leave');
      socket.leave(socket.room);
      socket.room = null;
    });

    socket.on('manualDisconnect', function() {
      console.log('manual disconnect');
      socket.leave(socket.room);
      socket.disconnect();
    });

  });

};