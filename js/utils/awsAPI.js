'use strict';

var APIUtils = require('./APIUtils');

var awsAPI = {

  uploadUserImage: function(image, userId) {
    return APIUtils.uploadFile('upload/user/' + userId, image);
  },

  uploadCourseImage: function(image, courseId) {
    return APIUtils.uploadFile('upload/course/' + courseId, image);
  },

  uploadLessonImage: function(image, lessonId) {
    return APIUtils.uploadFile('upload/lesson/' + lessonId, image);
  }

};

module.exports = awsAPI;