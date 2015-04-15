'use strict';

var CurrentQuizStore = require('../../../js/stores/CurrentQuizStore');
var LessonActions    = require('../../../js/actions/LessonActions');
var QuizActions    = require('../../../js/actions/QuizActions');

require('../../../utils/createAuthenticatedSuite')('Store: Quiz', function() {

  it('should be empty on init', function(done) {
    (CurrentQuizStore.quiz === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load a quiz on action', function(done) {
    done();
  });

  it('should mark a quiz started on action', function(done) {
    done();
  });

  it('should load a question on action', function(done) {
    done();
  });

  it('check an answer on action', function(done) {
    done();
  });

  it('mark a quiz finished on action', function(done) {
    done();
  });

});