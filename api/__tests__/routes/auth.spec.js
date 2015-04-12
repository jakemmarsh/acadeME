'use strict';

var request = require('supertest');

describe('auth routes', function() {

  var url = 'http://localhost:3000/api/';

  it('should return an error on initial check', function(done) {
    request(url)
    .get('auth/check')
    .end(function(err, res) {
      res.status.should.be.equal(401);
      done();
    });
  });

  it('should register a new user', function(done) {
    var profile = {
      email: 'jane.doe@gmail.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'janedoe1'
    };

    request(url)
    .post('auth/register')
    .send(profile)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('email');
      res.body.should.have.property('firstName');
      res.body.should.have.property('lastName');
      done();
    });
  });

  it('should log a user in', function(done) {
    var user = {
      email: 'test@test.com',
      password: 'test'
    };

    request(url)
    .post('auth/login')
    .send(user)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('email');
      res.body.should.have.property('firstName');
      res.body.should.have.property('lastName');
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should receive a user when checking after log in', function(done) {
    var req = request(url).get('auth/check');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('email');
      res.body.should.have.property('firstName');
      res.body.should.have.property('lastName');
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should log a user out', function(done) {
    var req = request(url).post('auth/logout');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });

});