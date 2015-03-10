'use strict';

var APIUtils = require('./APIUtils');

var CourseAPI = {

  get: function(id) {
    return APIUtils.get('course/' + id);
  },

  getAll: function() {
    return APIUtils.get('course');
  },

  getNewest: function() {
    return APIUtils.get('course/newest');
  },

  getTrending: function() {
    return APIUtils.get('course/trending');
  },

  searchAll: function(query) {
    return APIUtils.get('course/search/' + query);
  },

  create: function(course) {
    return APIUtils.post('course', course);
  },

  createLesson: function(courseId, lesson) {
    return APIUtils.post('course/' + courseId + '/lesson', lesson);
  },

  search: function(id, query) {
    return APIUtils.get('course/'+ id + '/search/' + query);
  },

  delete: function(id) {
    return APIUtils.del('course/' + id);
  }

};

module.exports = CourseAPI;