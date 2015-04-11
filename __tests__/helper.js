'use strict';

before(function(done) {

  this.timeout(10000);

  // Ensure that 'should' library methods will be
  // available to all tests
  require('should');

  // Start and configure the server
  require('../server');

  // Wait 3 seconds before calling "done" to ensure
  // that DB is connected and populated
  setTimeout(done, 3000);

});