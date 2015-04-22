'use strict';

var Reflux        = require('reflux');
var _             = require('lodash');

var PageActions   = require('../actions/PageActions');
var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var UserCurriculumStore = Reflux.createStore({

  init: function() {
    this.courses = null;

    this.listenTo(PageActions.openCurriculum, this.loadUserCourses);
    this.listenTo(CourseActions.enroll, this.enrollInCourse);
    this.listenTo(CourseActions.unEnroll, this.unEnrollFromCourse);
  },

  loadUserCourses: function(currentUserId, cb) {
    cb = cb || function() {};

    console.log('retrieve user courses for:', currentUserId);

    CourseAPI.getForUser(currentUserId).then(function(courses) {
      this.courses = courses || [];
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving user courses:', err);
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  enrollInCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('enroll in course:', courseId);

    CourseAPI.enroll(courseId).then(function(newCourse) {
      this.courses.push(newCourse);
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      console.log('error enrolling in course:', err);
      cb(err);
    }.bind(this));
  },

  unEnrollFromCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('unenroll from course:', courseId);

    CourseAPI.unEnroll(courseId).then(function() {
      this.courses = _.reject(this.courses, function(course) {
        return course.id === courseId;
      });
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      console.log('error unenrolling from course:', err);
      cb(err);
    }.bind(this));
  }

});

module.exports = UserCurriculumStore;