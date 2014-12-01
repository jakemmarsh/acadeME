'use strict';

var when   = require('when');
var _      = require('underscore');
var models = require('../models');

/* ====================================================== */

exports.upsertConversation = function(courseId, users) {

  var deferred = when.defer();
  var defaultConversation = {};

  models.Conversation.findOrCreate({
    where: { CourseId: courseId },
    defaults: defaultConversation // TODO: should this be passed as defaults?
  }).spread(function(conversation, created) {
    models.User.findAll({
      where: { id: _.pluck(users, 'id') }
    }).then(function(retrievedUsers) {
      conversation.setUsers(retrievedUsers).then(function(updatedConversation) {
        deferred.resolve(updatedConversation);
      });
    });
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;

};

/* ====================================================== */

exports.saveMessage = function(courseId, message) {

  var deferred = when.defer();

  message = _.extend(message, {
    CourseId: courseId
  });

  models.Message.create(message).then(function(createdMessage) {
    deferred.resolve(createdMessage);
  }).catch(function(err) {
    deferred.reject(err);
  });

  return deferred.promise;

};