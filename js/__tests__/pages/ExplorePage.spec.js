'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var sinon       = require('sinon');
var superagent  = require('superagent');
var TestHelpers = require('../../../utils/testHelpers');
var ExplorePage = require('../../../js/pages/ExplorePage.jsx');

require('../../../utils/createAuthenticatedSuite')('Page: Explore', function() {

  var page;

  beforeEach(function(done) {
    TestHelpers.testPage('/explore', ExplorePage, function(component) {
      page = component;
      done();
    });
  });

  it('should exist', function(done) {
    should.exist(page.getDOMNode());
    done();
  });

  it('should render newest courses before search', function(done) {
    var headline = TestUtils.findRenderedDOMComponentWithClass(page, 'newest-courses-title');
    var courseList = TestUtils.findRenderedDOMComponentWithClass(page, 'newest-courses-list');

    should.exist(headline);
    should.exist(courseList);

    done();
  });

  it('should render trending courses before search', function(done) {
    var headline = TestUtils.findRenderedDOMComponentWithClass(page, 'trending-courses-title');
    var courseList = TestUtils.findRenderedDOMComponentWithClass(page, 'trending-courses-list');

    should.exist(headline);
    should.exist(courseList);

    done();
  });

  it('should update the query on search', function(done) {
    var input = TestUtils.findRenderedDOMComponentWithClass(page, 'search');

    TestUtils.Simulate.change(input, { target: { value: 'test' } });

    page.state.query.should.be.exactly('test');

    done();
  });

  it('should submit search on enter', function(done) {
    var input = TestUtils.findRenderedDOMComponentWithClass(page, 'search');
    var submitSpy = sinon.spy(page, 'submitOnEnter');

    TestUtils.Simulate.change(input, { target: { value: 'test' } });

    page.state.query.should.be.exactly('test');

    TestUtils.Simulate.keyPress(input, { key: 'Enter' });

    (submitSpy.called).should.be.true; // jshint ignore:line

    submitSpy.restore();
    done();
  });

});