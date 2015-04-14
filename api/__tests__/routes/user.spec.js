'use strict';

var request = require('supertest');

require('../../../helpers/createAuthenticatedSuite')('user routes', function() {

  var url = 'http://localhost:3000/api/';

  it('should retrieve a single user by identifier', function(done) {
    request(url)
    .get('user/1')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('email');
      res.body.should.have.property('firstName');
      res.body.should.have.property('lastName');
      done();
    });
  });

});