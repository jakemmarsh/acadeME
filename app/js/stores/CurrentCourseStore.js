'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');

var CurrentCourseStore = Reflux.createStore({

  init: function() {
    this.listenTo(CourseActions.openCourse, this.openCourse);
  },

  openCourse: function(courseId, cb) {
    cb = cb || function() {};

    console.log('retrieve course for:', courseId);

    var course = {
      id: 0,
      title: 'Human-Computer Interaction',
      instructor: {
        name: 'Joe Black'
      },
      percentageComplete: 35
    };

    this.currentCourse = course;

    // TODO: load course from database

    this.trigger(course);
    cb();
  }

});

module.exports = CurrentCourseStore;