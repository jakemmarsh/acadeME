'use strict';

var when   = require('when');
var _      = require('underscore');
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
      where: query
    }).then(function(lesson) {
      if ( _.isEmpty(lesson) ) {
        deferred.reject({
          status: 404,
          body: 'Lesson could not be found at identifier: ' + identifier
        });
      } else {
        deferred.resolve(lesson);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  getLesson(req.params.identifier).then(function(lesson) {
    res.status(200).json(lesson);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteLesson = function(id) {
    var deferred = when.defer();

    models.Lesson.destroy({ id: id }).then(function() {
      models.Quiz.destroy({ CourseId: id }).then(function() {
        deferred.resolve();
      }).catch(function(err) {
        deferred.reject({
          status: 500,
          body: err
        });
      });
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  deleteLesson(req.params.id).then(function() {
    res.status(200).json('Lesson successfully deleted.');
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};