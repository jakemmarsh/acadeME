'use strict';

var CurrentLessonStore = require('../../../js/stores/CurrentLessonStore');
var LessonActions      = require('../../../js/actions/LessonActions');

describe('Store: CurrentLesson', function() {

  it('should be empty on init', function(done) {
    (CurrentLessonStore.lesson === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load lesson on action', function(done) {
    LessonActions.openLesson(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentLessonStore.lesson.should.be.instanceOf(Object);
      CurrentLessonStore.lesson.should.have.property('title');
      CurrentLessonStore.lesson.should.have.property('description');
      CurrentLessonStore.lesson.should.have.property('bodyElements');
      done();
    });
  });

});