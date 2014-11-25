'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var CurrentCourseStore = Reflux.createStore({

  init: function() {
    this.listenTo(CourseActions.openCourse, this.openCourse);
    this.listenTo(CourseActions.createLesson, this.createLesson);
  },

  openCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('retrieve course for:', courseId);

    CourseAPI.get(courseId).then(function(course) {
      this.course = course;
      this.trigger(course);
      cb();
    }.bind(this)).catch(function(err) {
      // TODO: handle error
      console.log('error retrieving course:', err);
    });
  },

  createLesson: function(lesson, cb) {
    cb = cb || function () {};

    CourseAPI.createLesson(this.course.id, lesson).then(function(lesson) {
      cb(lesson);
      this.openCourse(this.course.id);
    }.bind(this)).catch(function(err) {
      // TODO: handle error
      console.log('error creating lesson:', err);
    });
  }

});

module.exports = CurrentCourseStore;