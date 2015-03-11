'use strict';

var Reflux      = require('reflux');

var PageActions = require('../actions/PageActions');
var CourseAPI   = require('../utils/CourseAPI');

var ExplorePageStory = Reflux.createStore({

  init: function() {
    this.courses = {
      newest: [],
      trending: [],
      results: []
    };

    this.listenTo(PageActions.openExplore, this.loadInitialCourses);
    this.listenTo(PageActions.searchAllCourses, this.searchAllCourses);
  },

  loadInitialCourses: function(cb) {
    cb = cb || function() {};

    console.log('retrieve initial courses');

    CourseAPI.getNewest().then(function(newestCourses) {
      CourseAPI.getTrending().then(function(trendingCourses) {
        this.courses.newest = newestCourses || [];
        this.courses.trending = trendingCourses || [];
        cb(null, this.courses);
        this.trigger(null, this.courses);
      }.bind(this));
    }.bind(this)).catch(function(err) {
      console.log('error retrieving newest courses:', err);
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  searchAllCourses: function(query, cb) {
    cb = cb || function() {};

    CourseAPI.searchAll(query).then(function(results) {
      this.courses.results = results || [];
      cb(null, this.courses);
      this.trigger(null, this.courses);
    }.bind(this)).catch(function(err) {
      console.log('error retrieving course search results:', err);
      this.courses = null;
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

});

module.exports = ExplorePageStory;