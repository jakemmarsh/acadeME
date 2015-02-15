'use strict';

var when   = require('when');
var _      = require('lodash');
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

exports.saveMessage = function(data) {

  var mainDeferred = when.defer();
  var attachment = data.attachment || null;
  var message = {
    body: data.message.body || data.message.Body || '',
    ConversationId: data.message.conversationId || data.message.ConversationId,
    UserId: data.message.userId || data.message.UserId
  };

  var createMessage = function(message, attachment) {
    var deferred = when.defer();

    models.Message.create(message).then(function(createdMessage) {
      deferred.resolve([createdMessage, attachment]);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var updateAttachment = function(data) {
    var deferred = when.defer();
    var message = data[0];
    var attachment = data[1];

    if ( attachment ) {
      models.Attachment.find({
        where: { id: attachment.id }
      }).then(function(retrievedAttachment) {
        if ( !_.isEmpty(retrievedAttachment) ) {
          retrievedAttachment.updateAttributes({
            MessageId: message.id
          }).then(function(updatedAttachment) {
            deferred.resolve([message, updatedAttachment]);
          });
        } else {
          deferred.reject();
        }
      }).catch(function(err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve([message, attachment]);
    }

    return deferred.promise;
  };

  var updateMessage = function(data) {
    var deferred = when.defer();
    var message = data[0];
    var attachment = data[1];

    if ( attachment ) {
      models.Message.find({
        where: { id: message.id }
      }).then(function(retrievedMessage) {
        retrievedMessage.setAttachment(attachment).then(function(updatedMessage) {
          deferred.resolve(updatedMessage);
        });
      }).catch(function(err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve(message);
    }

    return deferred.promise;
  };

  createMessage(message, attachment)
  .then(updateAttachment)
  .then(updateMessage)
  .then(mainDeferred.resolve);

  return mainDeferred.promise;

};