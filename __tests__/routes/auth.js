'use strict';

var request = require('supertest');

describe('auth routes', function() {

  it('should return an error on initial check', function(done) {
    request('http://localhost:3000')
    .get('/api/auth/check')
    .end(function(err, res) {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('registers a new user', function(done) {
    done();
  });

  it('logs a user in', function(done) {
    done();
  });

  it('logs a user out', function(done) {
    done();
  });

});