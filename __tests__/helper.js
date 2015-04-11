'use strict';

var express = require('express');

/* ====================================================== */

before(function(done) {

  this.timeout(10000);

  var server = express();

  require('should');

  global.server = server.listen(3000, function() {
    console.log('server is listening');
    server.use('/api', require('../api')(global.server));

    // Wait 5 seconds before calling "done" to ensure
    // that DB is connected and populated
    setTimeout(done, 5000);
  });

});

/* ====================================================== */

after(function() {

  global.server.close();

});