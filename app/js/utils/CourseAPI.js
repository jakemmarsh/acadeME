'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var CourseAPI = {

  get: function(id) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'course/' + id).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getAll: function() {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'course').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  create: function(course) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'course', course).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  createLesson: function(courseId, lesson) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'course/' + courseId + '/lesson', lesson).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  search: function(id, query) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'course/' + id + '/search/' + query).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  delete: function(id) {
    var deferred = when.defer();

    request.delete(APIUtils.API_ROOT + 'course/' + id).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = CourseAPI;