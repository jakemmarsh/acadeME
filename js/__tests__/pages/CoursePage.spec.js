'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var sinon       = require('sinon');
var TestHelpers = require('../../../utils/testHelpers');
var CoursePage  = require('../../../js/pages/CoursePage.jsx');

require('../../../utils/createAuthenticatedSuite')('Page: Course', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/course/1', CoursePage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

});