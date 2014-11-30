'use strict';

module.exports = function(server, routes) {

  var io = require('socket.io').listen(server);

  io.on('connection', function(socket){
    console.log('a user connected!');
  });

};