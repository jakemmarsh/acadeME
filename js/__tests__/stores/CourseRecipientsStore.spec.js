'use strict';

var CourseRecipientsStore = require('../../../js/stores/CourseRecipientsStore');
var CourseActions         = require('../../../js/actions/CourseActions');

require('../../../utils/createAuthenticatedSuite')('Store: CourseRecipients', function() {

  it('should be empty on init', function(done) {
    (CourseRecipientsStore.recipients === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load recipients on action', function(done) {
    CourseActions.openChat(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CourseRecipientsStore.recipients.should.be.instanceOf(Array);
      CourseRecipientsStore.recipients[0].should.have.property('firstName');
      CourseRecipientsStore.recipients[0].should.have.property('lastName');
      done();
    });
  });

});