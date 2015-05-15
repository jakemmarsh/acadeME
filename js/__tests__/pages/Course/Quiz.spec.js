'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var sinon       = require('sinon');
var TestHelpers = require('../../../../utils/testHelpers');
var QuizPage    = require('../../../../js/pages/Course/Quiz.jsx');

require('../../../../utils/createAuthenticatedSuite')('Page: Quiz', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/course/1/lesson/1/quiz', QuizPage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

});