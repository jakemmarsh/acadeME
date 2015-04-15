'use strict';

var UserCurriculumStore = require('../../../js/stores/UserCurriculumStore');
var PageActions         = require('../../../js/actions/PageActions');
var CourseActions       = require('../../../js/actions/CourseActions');

require('../../../utils/createAuthenticatedSuite')('Store: CurrentLesson', function() {

  it('should be empty on init', function(done) {
    (UserCurriculumStore.courses === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load user courses on action', function(done) {
    PageActions.openCurriculum(4, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      UserCurriculumStore.courses.should.be.instanceOf(Array);
      UserCurriculumStore.courses[0].should.have.property('title');
      UserCurriculumStore.courses[0].should.have.property('description');
      done();
    });
  });

  it('should unenroll from a course on action', function(done) {
    var oldLength = UserCurriculumStore.courses.length;

    CourseActions.unenroll(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      UserCurriculumStore.courses.length.should.be.below(oldLength);
      done();
    });
  });

  it('should enroll in a course on action', function(done) {
    var oldLength = UserCurriculumStore.courses.length;

    CourseActions.enroll(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      UserCurriculumStore.courses.length.should.be.above(oldLength);
      done();
    });
  });

});