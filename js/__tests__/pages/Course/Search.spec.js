'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var sinon       = require('sinon');
var TestHelpers = require('../../../../utils/testHelpers');
var SearchPage  = require('../../../../js/pages/Course/Search.jsx');

require('../../../../utils/createAuthenticatedSuite')('Page: Course Search', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/course/1/lesson/1/quiz', SearchPage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

});