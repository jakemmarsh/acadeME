'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('quiz routes', function() {

  var url = 'http://localhost:3000';

  it('should retrieve a single lesson by ID', function(done) {
    var req = request(url).get('/api/lesson/1');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('title');
      res.body.should.have.property('description');
      res.body.should.have.property('bodyElements');
      done();
    });
  });

  it('should retrieve a single quiz by lesson ID', function(done) {
    request(url)
    .get('/api/lesson/1/quiz')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('description');
      res.body.should.have.property('tags');
      done();
    });
  });

});