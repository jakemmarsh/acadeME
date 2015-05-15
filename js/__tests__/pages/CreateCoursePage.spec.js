'use strict';

var React            = require('react/addons');
var TestUtils        = React.addons.TestUtils;
var should           = require('should');
var sinon            = require('sinon');
var TestHelpers      = require('../../../utils/testHelpers');
var CreateCoursePage = require('../../../js/pages/CreateCoursePage.jsx');
var awsAPI           = require('../../../js/utils/awsAPI');
var courseAPI        = require('../../../js/utils/courseAPI');

require('../../../utils/createAuthenticatedSuite')('Page: Create Course', function() {

  var page;
  var course = {
    id: 1,
    title: 'test',
    description: 'test'
  };

  beforeEach(function(done) {
    TestHelpers.testPage('/create', CreateCoursePage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

  it('should set the file and send to AWS when prompted', function(done) {
    var file = new File([], 'test');
    var uploadSpy = sinon.spy(awsAPI, 'uploadCourseImage');

    page.updateImage(file);

    page.uploadImage(course).then(function() {
      (uploadSpy.called).should.be.true; // jshint ignore:line
      done();
    });
  });

  it('should POST a new course when prompted', function(done) {
    var createSpy = sinon.spy(courseAPI, 'create');

    page.createCourse(course).then(function(createdCourse) {
      createdCourse.should.be.instanceof(Object);
      createdCourse.should.have.property('title');
      createdCourse.should.have.property('description');
      (createSpy.called).should.be.true; // jshint ignore:line
      done();
    });
  });

  it('should both upload an image and POST the course when submitted', function(done) {
    var createSpy = sinon.spy(page, 'createCourse');
    var uploadSpy = sinon.spy(page, 'uploadImage');
    var submitSpy = sinon.spy(page, 'handleSubmit');
    var titleInput = TestUtils.findRenderedDOMComponentWithClass(page, 'title-input');
    var descriptionInput = TestUtils.findRenderedDOMComponentWithClass(page, 'description-input');
    var submitButton = TestUtils.findRenderedDOMComponentWithClass(page, 'submit');

    TestUtils.Simulate.change(titleInput, { target: { value: 'test' } });
    TestUtils.Simulate.change(descriptionInput, { target: { value: 'test' } });
    TestUtils.Simulate.click(submitButton);

    (submitSpy.called).should.be.true; // jshint ignore:line
    (createSpy.called).should.be.true; // jshint ignore:line
    (uploadSpy.called).should.be.true; // jshint ignore:line
    done();
  });

});