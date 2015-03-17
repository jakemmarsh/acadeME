'use strict';

var when      = require('when');
var _         = require('lodash');
var Sequelize = require('sequelize');
var models    = require('../models');

/* ====================================================== */

function addUserCompletion(courses, currentUser) {

  var mainDeferred = when.defer();
  var shouldReturnArray = true;
  var promises = [];

  var countQuizzes = function(courseId, userId) {
    var deferred = when.defer();

    models.Lesson.count({
      where: { id: courseId }
    }).then(function(count) {
      deferred.resolve([courseId, userId, count]);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var countCompletions = function(data) {
    var deferred = when.defer();
    var courseId = data[0];
    var userId = data[1];
    var numQuizzes = data[2];
    var lessons;
    var percentage;

    models.QuizCompletion.findAll({
      where: {
        CourseId: courseId,
        UserId: userId
      }
    }).then(function(completions) {
      lessons = completions && completions.length ? _.pluck(completions, 'LessonId') : [];
      percentage = completions && completions.length ? Math.round((completions.length/numQuizzes)*100) : 0;
      deferred.resolve([lessons, percentage]);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var processCourse = function(course) {
    var deferred = when.defer();

    course = course.toJSON();

    if ( _.isEmpty(currentUser) ) {
      course.lessonsCompleted = [];
      course.percentageCompleted = 0;
      deferred.resolve(course);
    } else {
      countQuizzes(course.id, currentUser.id)
      .then(countCompletions)
      .then(function(data) {
        course.lessonsCompleted = data[0];
        course.percentageCompleted = data[1];
        deferred.resolve(course);
      }).catch(function(err) {
        deferred.reject({ status: 500, body: err });
      });
    }

    return deferred.promise;
  };

  if ( !_.isEmpty(courses) ) {
    if ( courses.constructor !== Array ) {
      courses = [courses];
      shouldReturnArray = false;
    }

    _.each(courses, function(course) {
      if ( !_.isEmpty(course) ) {
        promises.push(processCourse(course));
      }
    });

    when.all(promises).then(function(processed) {
      processed = shouldReturnArray ? processed : processed[0];
      mainDeferred.resolve(processed);
    }).catch(function(err) {
      mainDeferred.reject({ status: 500, body: err });
      //mainDeferred.resolve(courses); // Still resolve if error
    });
  } else {
    mainDeferred.resolve(courses);
  }

  return mainDeferred.promise;
}

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
          attributes: ['id', 'title', 'description', 'imageUrl'],
          include: {
            model: models.Quiz,
            attributes: ['id']
          }
        },
        {
          model: models.Enrollment,
          as: 'Enrollments',
          attributes: ['UserId']
        }
      ]
    }).then(function(course) {
      if ( _.isEmpty(course) ) {
        deferred.reject({ status: 404, body: 'Course could not be found at identifier: ' + identifier });
      } else {
        deferred.resolve(addUserCompletion(course, req.user));
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
      deferred.resolve(addUserCompletion(retrievedCourses, req.user));
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

exports.getForUser = function(req, res) {

  var getEnrollments = function(userId) {
    var deferred = when.defer();

    models.Enrollment.findAll({
      where: { UserId: userId }
    }).then(function(retrievedEnrollments) {
      deferred.resolve(retrievedEnrollments);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var getCourses = function(enrollments) {
    var deferred = when.defer();

    models.Course.findAll({
      where: { id: _.pluck(enrollments, 'CourseId') }
    }).then(function(retrievedCourses) {
      deferred.resolve(addUserCompletion(retrievedCourses, req.user));
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  getEnrollments(req.params.userId)
  .then(getCourses)
  .then(function(courses) {
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
      deferred.resolve(addUserCompletion(retrievedCourses, req.user));
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
      deferred.resolve(addUserCompletion(retrievedCourses, req.user));
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

exports.enroll = function(req, res) {

  var enrollUser = function(courseId, userId) {
    var deferred = when.defer();
    var enrollment = {
      CourseId: courseId,
      UserId: userId
    };

    models.Enrollment.create(enrollment).then(function() {
      deferred.resolve(courseId);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  var getCourse = function(courseId) {
    var deferred = when.defer();

    models.Course.find({
      where: { id: courseId }
    }).then(function(retrievedCourse) {
      deferred.resolve(retrievedCourse);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  enrollUser(req.params.id, req.user.id)
  .then(getCourse)
  .then(function(course) {
    res.status(200).json(course);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.error });
  });

};

/* ====================================================== */

exports.unEnroll = function(req, res) {

  var unEnrollUser = function(courseId, userId) {
    var deferred = when.defer();

    models.Enrollment.destroy({
      where: {
        CourseId: courseId,
        UserId: userId
      }
    }).then(function(resp) {
      deferred.resolve(resp);
    }).catch(function(err) {
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  unEnrollUser(req.params.id, req.user.id).then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, message: err.body.toString() });
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
      deferred.resolve(addUserCompletion(retrievedCourses, req.user));
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

    models.Course.destroy({
      where: { id: courseId }
    }).then(function() {
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