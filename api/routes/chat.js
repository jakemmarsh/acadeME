'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

/* ====================================================== */

exports.getRecipients = function(req, res) {

  var fetchEnrollments = function(currentUserId, courseId) {
    var deferred = when.defer();

    models.Enrollment.findAll({
      where: { CourseId: courseId }
    }).then(function(enrollments) {
      deferred.resolve(_.reject(enrollments, function(enrollment) {
        return enrollment.UserId === currentUserId;
      }));
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var fetchRecipients = function(enrollments) {
    var deferred = when.defer();

    models.User.findAll({
      where: { id: _.pluck(enrollments, 'UserId') }
    }).then(function(recipients) {
      deferred.resolve(recipients);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var userId = 1; // TODO: don't hardcode this, use req.user.id

  fetchEnrollments(userId, req.params.courseId)
  .then(fetchRecipients)
  .then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.getConversation = function(req, res) {

  var fetchConversation = function(courseId, userOneId, userTwoId) {
    var deferred = when.defer();

    models.Conversation.find({
      where: { CourseId: courseId, UserOneId: userOneId, UserTwoId: userTwoId },
      include: [
        {
          model: models.Message,
          include: [models.Attachment]
        }
      ]
    }).then(function(conversation) {
      if ( _.isEmpty(conversation) ) {
        deferred.reject({ status: 404, body: 'That conversation could not be found' });
      } else {
        deferred.resolve(conversation);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchConversation(req.params.courseId, req.query.userOne, req.query.userTwo).then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body.toString() });
  });

};

/* ====================================================== */

exports.getAnnotations = function(req, res) {

  var fetchAnnotations = function(attachmentId) {
    var deferred = when.defer();

    models.Annotation.findAll({
      where: { AttachmentId: attachmentId }
    }).then(function(annotations) {
      if ( !_.isEmpty(annotations) ) {
        deferred.resolve(annotations);
      } else {
        deferred.resolve([]);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  fetchAnnotations(req.params.attachmentId).then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body.toString() });
  });

};

/* ====================================================== */

exports.addAnnotation = function(req, res) {

  var saveAnnotation = function(annotation, attachmentId) {
    var deferred = when.defer();

    annotation = {
      text: annotation.Text || annotation.text,
      xPos: annotation.xpos || annotation.xPos,
      yPos: annotation.ypos || annotation.yPos,
      AttachmentId: attachmentId,
      UserId: req.user.id
    };

    models.Annotation.create(annotation).then(function(createdAnnotation) {
      deferred.resolve(createdAnnotation);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  saveAnnotation(req.body, req.params.attachmentId).then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body.toString() });
  });

};