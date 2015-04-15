'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var CurrentCourseStore = Reflux.createStore({

  init: function() {
    this.course = null;

    this.listenTo(CourseActions.openCourse, this.openCourse);
    this.listenTo(CourseActions.setCourse, this.setCourse);
    this.listenTo(CourseActions.createLesson, this.createLesson);
  },

  setCourse: function(course, cb) {
    cb = cb || function() {};

    this.course = course;
    console.log('set course:', course.id);
    cb(null, this.course);
    this.trigger(null, this.course);
  },

  openCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('retrieve course for:', courseId);

    CourseAPI.get(courseId).then(function(course) {
      this.setCourse(course, cb);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving course:', err);
      this.course = null;
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  createLesson: function(lesson, cb) {
    cb = cb || function () {};

    console.log('create lesson:', lesson);

    CourseAPI.createLesson(this.course.id, lesson).then(function(lesson) {
      cb(null, lesson);
      this.openCourse(this.course.id);
    }.bind(this)).catch(function(err) {
      console.log('error creating lesson:', err);
      cb(err);
    }.bind(this));
  }

});

module.exports = CurrentCourseStore;