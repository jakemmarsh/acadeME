'use strict';

var CurrentUserStore = require('../../../js/stores/CurrentUserStore');
var UserActions      = require('../../../js/actions/UserActions');

describe('Store: CurrentUser', function() {

  it('should be empty on init', function(done) {
    (CurrentUserStore.user === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should set user on action', function(done) {
    var user = {
      id: 1
    };

    UserActions.set(user, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentUserStore.user.should.be.instanceOf(Object);
      CurrentUserStore.user.id.should.equal(1);
      done();
    });
  });

  it('should log user in on action', function(done) {
    var user = {
      email: 'test@test.com',
      password: 'test'
    };

    UserActions.login(user, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentUserStore.user.should.be.instanceOf(Object);
      CurrentUserStore.user.should.have.property('firstName');
      CurrentUserStore.user.should.have.property('lastName');
      done();
    });
  });

});