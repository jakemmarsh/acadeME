'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('course routes', function() {

  var url = 'http://localhost:3000';

  it('should create a new quiz', function(done) {
    var quiz = {
      description: 'This is a description of a quiz.',
      tags: ['foo', 'bar', 'buzz'],
      numQuestions: 10
    };

    request(url)
    .post('/api/course/1/lesson/1/quiz')
    .send(quiz)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('description');
      res.body.should.have.property('tags');
      done();
    });
  });

});