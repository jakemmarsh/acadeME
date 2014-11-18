'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var CurrentCourseStore = Reflux.createStore({

  init: function() {
    this.listenTo(CourseActions.openCourse, this.openCourse);
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
  }

});

module.exports = CurrentCourseStore;