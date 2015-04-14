'use strict';

var should    = require('should');
var chatUtils = require('../../utils/chat');

require('../../../utils/createAuthenticatedSuite')('Chat utils', function() {

  it('should upsert a conversation', function(done) {
    var courseId = 1;
    var userOneId = 1;
    var userTwoId = 2;

    chatUtils.upsertConversation(courseId, userOneId, userTwoId).then(function(conversation) {
      conversation.should.have.property('CourseId');
      conversation.should.have.property('UserOneId');
      conversation.should.have.property('UserTwoId');
      done();
    });
  });

  it('should save a new message without an attachment', function(done) {
    var data = {
      attachment: null,
      message: {
        body: 'This is a message!',
        ConversationId: 1,
        UserId: 2
      }
    };

    chatUtils.saveMessage(data).then(function(resp) {
      should.not.exist(resp[1]);
      resp[0].should.have.property('body');
      resp[0].should.have.property('ConversationId');
      resp[0].should.have.property('UserId');
      done();
    });
  });

});