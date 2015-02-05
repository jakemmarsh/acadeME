'use strict';

var APIUtils = require('./APIUtils');

var awsAPI = {

  uploadCourseImage: function(image, courseId) {
    return APIUtils.uploadFile('upload/course/' + courseId, image);
  },

  uploadLessonImage: function(image, lessonId) {
    return APIUtils.uploadFile('upload/lesson/' + lessonId, image);
  }

};

module.exports = awsAPI;