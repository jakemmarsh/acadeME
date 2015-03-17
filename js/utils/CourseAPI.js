'use strict';

var APIUtils = require('./APIUtils');

var CourseAPI = {

  get: function(id) {
    return APIUtils.get('course/' + id);
  },

  getAll: function() {
    return APIUtils.get('course');
  },

  getForUser: function(userId) {
    return APIUtils.get('course/user/' + userId);
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

  enroll: function(id) {
    return APIUtils.post('course/' + id + '/enroll');
  },

  unEnroll: function(id) {
    return APIUtils.del('course/' + id + '/enroll');
  },

  create: function(course) {
    return APIUtils.post('course', course);
  },

  createLesson: function(courseId, lesson) {
    return APIUtils.post('course/' + courseId + '/lesson', lesson);
  },

  createQuiz: function(quiz, courseId, lessonId) {
    return APIUtils.post('course/' + courseId + '/lesson/' + lessonId + '/quiz', quiz);
  },

  search: function(id, query) {
    return APIUtils.get('course/'+ id + '/search/' + query);
  },

  delete: function(id) {
    return APIUtils.del('course/' + id);
  }

};

module.exports = CourseAPI;