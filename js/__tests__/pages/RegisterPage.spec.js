'use strict';

var React        = require('react/addons');
var TestUtils    = React.addons.TestUtils;
var should       = require('should');
var sinon        = require('sinon');
var TestHelpers  = require('../../../utils/testHelpers');
var RegisterPage = require('../../../js/pages/RegisterPage.jsx');

require('../../../utils/createAuthenticatedSuite')('Page: Register', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/register', RegisterPage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

});