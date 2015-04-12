'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getLesson = function(identifier) {
    var deferred = when.defer();
    var query = { id: identifier };

    if ( isNaN(parseInt(identifier)) ) {
      query = { slug: identifier };
    }

    models.Lesson.find({
      where: query,
      include: {
        model: models.Quiz,
        attributes: ['id']
      }
    }).then(function(lesson) {
      if ( _.isEmpty(lesson) ) {
        deferred.reject({ status: 404, body: 'Lesson could not be found at identifier: ' + identifier });
      } else {
        deferred.resolve(lesson);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getLesson(req.params.identifier).then(function(lesson) {
    res.status(200).json(lesson);
  }, function(err) {
    res.status(err.status).json({ error: err.body });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteLesson = function(id) {
    var deferred = when.defer();

    models.Lesson.destroy({
      where: { id: id }
    }).then(function() {
      deferred.resolve();
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  deleteLesson(req.params.id).then(function() {
    res.status(200).json({ status: 200, message: 'Lesson successfully deleted.' });
  }, function(err) {
    res.status(err.status).json({ status: err.status, error: err.body });
  });

};