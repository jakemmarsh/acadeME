'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('quiz routes', function() {

  var url = 'http://localhost:3000';

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