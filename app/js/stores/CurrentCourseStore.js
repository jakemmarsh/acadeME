'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var CurrentCourseStore = Reflux.createStore({

  init: function() {
    this.course = null;

    this.listenTo(CourseActions.openCourse, this.openCourse);
    this.listenTo(CourseActions.createLesson, this.createLesson);
  },

  openCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('retrieve course for:', courseId);

    CourseAPI.get(courseId).then(function(course) {
      this.course = course;
      cb(null, this.course);
      this.trigger(null, this.course);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving course:', err);
      this.course = null;
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  createLesson: function(lesson, cb) {
    cb = cb || function () {};

    CourseAPI.createLesson(this.course.id, lesson).then(function(lesson) {
      cb(null, lesson);
      this.openCourse(this.course.id);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving lesson:', err);
      cb(err);
      this.trigger(err);
    }.bind(this));
  }

});

module.exports = CurrentCourseStore;