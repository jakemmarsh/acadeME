'use strict';

var CurrentConversationStore = require('../../../js/stores/CurrentConversationStore');
var ChatActions              = require('../../../js/actions/ChatActions');

require('../../../utils/createAuthenticatedSuite')('Store: CurrentConversation', function() {

  it('should be empty on init', function(done) {
    (CurrentConversationStore.conversation === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should open a conversation on action', function(done) {
    ChatActions.openConversation(1, 2, 4, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentConversationStore.conversation.should.be.instanceOf(Object);
      CurrentConversationStore.conversation.should.have.property('courseId');
      CurrentConversationStore.conversation.should.have.property('userOneId');
      CurrentConversationStore.conversation.should.have.property('userTwoId');
      done();
    });
  });

});