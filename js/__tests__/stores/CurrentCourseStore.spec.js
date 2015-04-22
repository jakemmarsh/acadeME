'use strict';

var CurrentCourseStore = require('../../../js/stores/CurrentCourseStore');
var CourseActions      = require('../../../js/actions/CourseActions');

require('../../../utils/createAuthenticatedSuite')('Store: CurrentCourse', function() {

  it('should be empty on init', function(done) {
    (CurrentCourseStore.course === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should set course on action', function(done) {
    var course = {
      id: 1
    };

    CourseActions.setCourse(course, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentCourseStore.course.should.be.instanceOf(Object);
      CurrentCourseStore.course.id.should.equal(1);
      done();
    });
  });

  it('should load a course on action', function(done) {
    CourseActions.openCourse(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentCourseStore.course.should.be.instanceOf(Object);
      CurrentCourseStore.course.id.should.equal(1);
      CurrentCourseStore.course.should.have.property('title');
      CurrentCourseStore.course.should.have.property('slug');
      CurrentCourseStore.course.should.have.property('description');
      done();
    });
  });

  it('should create a new lesson on action', function(done) {
    var lesson = {
      title: 'lesson to test creation',
      description: 'test description',
      bodyElements: []
    };

    // Make sure `this.course` is set in store before attempting to access `this.course.id`
    CourseActions.setCourse({ id: 1 }, function() {
      CourseActions.createLesson(lesson, function(err, lesson) {
        console.log('error creating lesson:', err);
        (err === null).should.be.true; // jshint ignore:line
        lesson.should.be.instanceOf(Object);
        lesson.should.have.property('title');
        lesson.should.have.property('description');
        lesson.should.have.property('bodyElements');
        done();
      });
    });
  });

});