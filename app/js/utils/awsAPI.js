'use strict';

var APIUtils = require('./APIUtils');

var awsAPI = {

  uploadCourseImage: function(image, courseId) {
    return APIUtils.uploadImage('upload/course/' + courseId, image);
  },

  uploadLessonImage: function(image, lessonId) {
    return APIUtils.uploadImage('upload/lesson/' + lessonId, image);
  }

};

module.exports = awsAPI;