'use strict';

var React            = require('react/addons');
var TestUtils        = React.addons.TestUtils;
var should           = require('should');
var sinon            = require('sinon');
var TestHelpers      = require('../../../../utils/testHelpers');
var CreateLessonPage = require('../../../../js/pages/Course/CreateLesson.jsx');

require('../../../../utils/createAuthenticatedSuite')('Page: Create Lesson', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/course/1/create', CreateLessonPage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

});