'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('chat routes', function() {

  var url = 'http://localhost:3000/api/';

  it('should return a list of recipients for the current user', function(done) {
    var req = request(url).get('chat/1/recipients');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('email');
      res.body[0].should.have.property('firstName');
      res.body[0].should.have.property('lastName');
      done();
    });
  });

  it('should return a single conversation', function(done) {
    var req = request(url).get('chat/1/conversation?userOne=2&userTwo=4');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Object);
      done();
    });
  });

  it('should get annotations for an attachment', function(done) {
    var req = request(url).get('chat/annotations/1');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('text');
      res.body[0].should.have.property('xPos');
      res.body[0].should.have.property('yPos');
      done();
    });
  });

  it('should add an annotation for an attachment', function(done) {
    var req = request(url).post('chat/annotations/1');
    var annotation = {
      text: 'This is the text of an annotation.',
      xPos: 100,
      yPos: 100
    };

    req.cookies = global.cookies;

    req.send(annotation).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('text');
      res.body.should.have.property('xPos');
      res.body.should.have.property('yPos');
      done();
    });
  });

});