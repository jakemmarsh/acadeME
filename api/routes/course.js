'use strict';

var when      = require('when');
var _         = require('lodash');
var Sequelize = require('sequelize');
var models    = require('../models');

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
          attributes: ['id', 'title', 'description', 'imageUrl']
        }
      ]
    }).then(function(course) {
      if ( _.isEmpty(course) ) {
        deferred.reject({ status: 404, body: 'Course could not be found at identifier: ' + identifier });
      } else {
        deferred.resolve(course);
      }
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getCourse(req.params.identifier).then(function(course) {
    res.status(200).json(course);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.getAll = function(req, res) {

  var getCourses = function() {
    var deferred = when.defer();

    models.Course.findAll({}).then(function(retrievedCourses) {
      deferred.resolve(retrievedCourses);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getCourses().then(function(courses) {
    res.status(200).json(courses);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.getNewest = function(req, res) {
  var getNewestCourses = function() {
    var deferred = when.defer();

    models.Course.findAll({
      order: ['createdAt'],
      limit: 20
    }).then(function(retrievedCourses) {
      deferred.resolve(retrievedCourses);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getNewestCourses().then(function(courses) {
    res.status(200).json(courses);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });
};

/* ====================================================== */

exports.getTrending = function(req, res) {
  var getTrendingCourses = function() {
    var deferred = when.defer();

    models.Course.findAll({
      order: ['createdAt'],
      limit: 20
    }).then(function(retrievedCourses) {
      deferred.resolve(retrievedCourses);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getTrendingCourses().then(function(courses) {
    res.status(200).json(courses);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};

/* ====================================================== */

exports.create = function(req, res) {

  var createCourse = function(course) {
    var deferred = when.defer();

    course = {
      title: course.title || course.Title,
      description: course.description || course.Description,
      imageUrl: course.imageUrl || course.ImageUrl,
      InstructorId: course.instructorId || course.InstructorId || req.user.id
    };

    models.Course.create(course).then(function(createdCourse) {
      deferred.resolve(createdCourse);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  createCourse(req.body).then(function(createdCourse) {
    res.status(200).json(createdCourse);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.error });
  });

};

/* ====================================================== */

exports.searchAll = function(req, res) {

  var searchAllCourses = function(query) {
    var deferred = when.defer();

    models.Course.findAll({
      where: Sequelize.or(
        { title: { ilike: '%' + query + '%' } },
        { description: { ilike: '%' + query + '%' } }
      )
    }).then(function(retrievedCourses) {
      deferred.resolve(retrievedCourses);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  searchAllCourses(req.params.query).then(function(playlists) {
    res.status(200).json(playlists);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body.toString() });
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
    res.status(err.status).json({ status: err.status, message: err.body });
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
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  create(req.params.id, req.body).then(function(createdLesson) {
    res.status(200).json(createdLesson);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.error });
  });

};

/* ====================================================== */

exports.delete = function(req, res) {

  var deleteCourse = function(courseId) {
    var deferred = when.defer();

    models.Course.destroy({ id: courseId }).then(function() {
      deferred.resolve(courseId);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  deleteCourse(req.params.id).then(function() {
    res.status(200).json('Course successfully deleted.');
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body });
  });

};