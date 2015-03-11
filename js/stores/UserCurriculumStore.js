'use strict';

var Reflux           = require('reflux');
var _                = require('lodash');

var PageActions      = require('../actions/PageActions');
var CourseActions    = require('../actions/CourseActions');
var CourseAPI        = require('../utils/CourseAPI');
var CurrentUserStore = require('./CurrentUserStore');

var UserCurriculumStore = Reflux.createStore({

  init: function() {
    this.courses = null;

    this.listenTo(PageActions.openCurriculum, this.loadUserCourses);
    this.listenTo(CourseActions.enroll, this.enrollInCourse);
    this.listenTo(CourseActions.unEnroll, this.unEnrollFromCourse);
    this.listenTo(CurrentUserStore, this.loadUserCourses.bind(this, null));
  },

  loadUserCourses: function(cb) {
    cb = cb || function() {};

    console.log('retrieve user courses');

    if ( !_.isEmpty(CurrentUserStore.user) ) {
      CourseAPI.getForUser(CurrentUserStore.user.id).then(function(courses) {
        this.courses = courses || [];
        cb(null, this.courses);
        this.trigger(null, this.courses);
      }.bind(this)).catch(function(err) {
        console.log('error retrieving user courses:', err);
        cb(err);
        this.trigger(err);
      }.bind(this));
    } else {
      cb();
    }
  },

  enrollInCourse: function(courseId, cb) {
    cb = cb || function() {};

    CourseAPI.enroll(courseId).then(function(newCourse) {
      this.courses.push(newCourse);
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      cb(err);
    }.bind(this));
  },

  unEnrollFromCourse: function(courseId, cb) {
    cb = cb || function() {};

    CourseAPI.unEnroll(courseId).then(function() {
      this.courses = _.remove(this.courses, function(course) {
        return course.id === courseId;
      });
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      cb(err);
    }.bind(this));
  }

});

module.exports = UserCurriculumStore;