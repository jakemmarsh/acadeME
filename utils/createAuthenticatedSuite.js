'use strict';

var request = require('supertest');

module.exports = function(name, tests) {

  var url = 'http://localhost:3000';

  describe(name, function() {

    this.timeout(5000);

    before(function(done) {
      var user = {
        email: 'test@test.com',
        password: 'test'
      };

      request(url)
      .post('/api/auth/login')
      .send(user)
      .end(function(err, res) {
        global.cookies = res.headers['set-cookie'].pop().split(';')[0];
        setTimeout(done, 1000);
      });
    });

    tests.call(this);

  });

};