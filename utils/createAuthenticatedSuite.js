'use strict';

var request = require('supertest');
var url     = 'http://localhost:3000/api/';
var agent   = request.agent(url);

module.exports = function(name, tests) {

  describe(name, function() {

    this.timeout(5000);

    beforeEach(function(done) {
      var user = {
        email: 'test@test.com',
        password: 'test'
      };

      agent.post('auth/login')
      .send(user)
      .end(function(err, res) {
        if ( !global.agent ) { global.agent = agent; }
        // global.cookies = res.headers['set-cookie'].pop().split(';')[0];
        global.agent.saveCookies(res);
        done();
      });
    });

    tests.call(this);

  });

};