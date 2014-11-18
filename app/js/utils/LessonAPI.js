'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var LessonAPI = {

  get: function(id) {
    var deferred = when.defer();

    // request.get(APIUtils.API_ROOT + 'lesson/' + id).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      id: id,
      title: 'Heuristic Evaluation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
      image_url: ''
    });

    return deferred.promise;
  },

  getQuiz: function(id) {
    var deferred = when.defer();

    // request.get(APIUtils.API_ROOT + 'lesson/' + id + '/quiz').end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      id: id,
      title: 'Test Quiz',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
      numQuestions: 10
    });

    return deferred.promise;
  },

  delete: function(id) {
    var deferred = when.defer();

    request.delete(APIUtils.API_ROOT + 'lesson/' + id).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = LessonAPI;