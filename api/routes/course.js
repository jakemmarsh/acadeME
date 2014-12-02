'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getCourse = function(identifier) {
    var deferred = when.defer();
    var query = { id: identifier };

    if ( isNaN(parseInt(identifier)) ) {
      query = { slug: identifier };
    }

    models.Course.find({
      where: query,
      include: [
        {
          model: models.User,
          as: 'Instructor'
        },
        {
          model: models.Lesson,
          attributes: ['id', 'title', 'description']
        }
      ]
    }).then(function(course) {
      if ( _.isEmpty(course) ) {
        deferred.reject({
          status: 404,
          body: 'Course could not be found at identifier: ' + identifier
        });
      } else {
        deferred.resolve(course);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  getCourse(req.params.identifier).then(function(course) {
    res.status(200).json(course);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.search = function(req, res) {

  var searchCourse = function(courseId, query) {
    var deferred = when.defer();

    // TODO: search course logic

    return deferred.promise;
  };

  searchCourse(req.params.id, req.params.query).then(function(results) {
    res.status(200).json(results);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.createLesson = function(req, res) {

  var create = function(courseId, lesson) {
    var deferred = when.defer();

    lesson = {
      CourseId: courseId,
      title: lesson.title || lesson.Title,
      description: lesson.description || lesson.Description,
      bodyElements: lesson.bodyElements || lesson.BodyElements,
      imageUrl: lesson.imageUrl || lesson.ImageUrl
    };

    models.Lesson.create(lesson).then(function(createdLesson) {
      deferred.resolve(createdLesson);
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  create(req.params.id, req.body).then(function(createdLesson) {
    res.status(200).json(createdLesson);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteCourse = function(id) {
    var deferred = when.defer();

    models.Course.destroy({ id: id }).then(function() {
      models.Lesson.destroy({ CourseId: id }).then(function() {
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

  deleteCourse(req.params.id).then(function() {
    res.status(200).json('Course successfully deleted.');
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};