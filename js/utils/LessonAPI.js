'use strict';

var APIUtils = require('./APIUtils');

var LessonAPI = {

  get: function(id) {
    return APIUtils.get('lesson/' + id);
  },

  getQuiz: function(id) {
    return APIUtils.get('lesson/' + id + '/quiz');

    // deferred.resolve({
    //   id: id,
    //   title: 'Test Quiz',
    //   description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
    //   numQuestions: 5
    // });
  },

  delete: function(id) {
    return APIUtils.del('lesson/' + id);
  }

};

module.exports = LessonAPI;