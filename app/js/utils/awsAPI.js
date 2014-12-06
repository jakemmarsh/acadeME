'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var awsAPI = {

  uploadCourseImage: function(image, courseId) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'upload/course/' + courseId)
      .attach('image', image)
      .end(function(res){
        if ( !res.ok ) {
          deferred.reject(JSON.parse(res.text));
        } else {
          deferred.resolve(APIUtils.normalizeResponse(res));
        }
      });

    return deferred.promise;
  },

  uploadLessonImage: function(image, lessonId) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'upload/lesson/' + lessonId)
      .attach('image', image)
      .end(function(res){
        if ( !res.ok ) {
          deferred.reject(JSON.parse(res.text));
        } else {
          deferred.resolve(APIUtils.normalizeResponse(res));
        }
      });

    return deferred.promise;
  }

};

module.exports = awsAPI;