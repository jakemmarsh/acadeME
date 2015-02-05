'use strict';

var when   = require('when');
var models = require('../models');

/* ====================================================== */

exports.upsertConversation = function(courseId, userOneId, userTwoId) {

  var deferred = when.defer();
  var defaultConversation = {
    CourseId: courseId,
    UserOneId: userOneId,
    UserTwoId: userTwoId
  };

  models.Conversation.findOrCreate({
    where: { CourseId: courseId, UserOneId: userOneId, UserTwoId: userTwoId },
    defaults: defaultConversation // TODO: should this be passed as defaults?
  }).spread(function(conversation) {
    deferred.resolve(conversation);
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;

};

/* ====================================================== */

exports.saveMessage = function(message) {

  var deferred = when.defer();

  message = {
    body: message.body || message.Body || '',
    attachment: message.attachment || message.Attachment,
    ConversationId: message.conversationId || message.ConversationId,
    UserId: message.userId || message.UserId
  };

  models.Message.create(message).then(function(createdMessage) {
    deferred.resolve(createdMessage);
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;

};