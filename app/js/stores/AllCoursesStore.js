'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var AllCoursesStore = Reflux.createStore({

  init: function() {
    this.course = null;

    this.listenTo(CourseActions.loadAll, this.loadAllCourses);
  },

  loadAllCourses: function(courseId, cb) {
    cb = cb || function() {};

    console.log('retrieve all courses');

    CourseAPI.getAll().then(function(courses) {
      this.courses = courses;
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving all courses:', err);
      this.courses = null;
      cb(err);
      this.trigger(err);
    }.bind(this));
  }

});

module.exports = AllCoursesStore;