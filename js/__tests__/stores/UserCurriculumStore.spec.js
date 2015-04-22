'use strict';

var UserCurriculumStore = require('../../../js/stores/UserCurriculumStore');
var PageActions         = require('../../../js/actions/PageActions');
var CourseActions       = require('../../../js/actions/CourseActions');

require('../../../utils/createAuthenticatedSuite')('Store: UserCurriculum', function() {

  it('should be empty on init', function(done) {
    (UserCurriculumStore.courses === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load user courses on action', function(done) {
    PageActions.openCurriculum(3, function(err, courses) {
      (err === null).should.be.true; // jshint ignore:line
      courses.should.be.instanceOf(Array);
      courses[0].should.be.instanceOf(Object);
      courses[0].should.have.property('title');
      courses[0].should.have.property('description');
      done();
    });
  });

  it('should unenroll from a course on action', function(done) {
    var oldLength = UserCurriculumStore.courses ? UserCurriculumStore.courses.length : 1;

    CourseActions.unEnroll(1, function(err, courses) {
      (err === null).should.be.true; // jshint ignore:line
      courses.should.be.instanceOf(Array);
      courses.length.should.be.below(oldLength);
      done();
    });
  });

  it('should enroll in a course on action', function(done) {
    var oldLength = UserCurriculumStore.courses ? UserCurriculumStore.courses.length : 0;

    CourseActions.enroll(1, function(err, courses) {
      (err === null).should.be.true; // jshint ignore:line
      courses.should.be.instanceOf(Array);
      courses.length.should.be.above(oldLength);
      done();
    });
  });

});