'use strict';

var Reflux        = require('reflux');

var CourseActions = require('../actions/CourseActions');
var CourseAPI     = require('../utils/CourseAPI');

var CourseSearchStore = Reflux.createStore({

  init: function() {
    this.results = null;

    this.listenTo(CourseActions.search, this.searchInCourse);
  },

  searchInCourse: function(courseId, query, cb) {
    cb = cb || function() {};

    console.log('search in course:', courseId, query);

    CourseAPI.search(courseId, query).then(function(results) {
      this.results = results;
      cb(null, this.results);
      this.trigger(null, this.results);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
      console.log('error getting search results for course:', courseId);
    }.bind(this));
  }
});

module.exports = CourseSearchStore;