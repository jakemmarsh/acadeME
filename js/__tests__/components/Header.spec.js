'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var Stub        = require('../../../utils/stubRouterContext.jsx');
var TestHelpers = require('../../../utils/testHelpers');

require('../../../utils/createAuthenticatedSuite')('Component: Header', function() {

  var user = TestHelpers.testUser;
  var HeaderComponent = Stub(require('../../components/Header.jsx'), { currentUser: user });
  var header;

  before(function() {
    header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
  });

  it('should exist', function(done) {
    should.exist(header.getDOMNode());
    done();
  });

  it('should render user dropdown on hover', function(done) {
    var dropdown;

    // Dropdown should initially be hidden, which throws an error on find
    try {
      dropdown = TestUtils.findRenderedDOMComponentWithClass(header, 'user-dropdown');
    } catch(e) {
      // Error should exist
      (e === null).should.be.false; // jshint ignore:line
    }

    TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithClass(header, 'dropdown-container'));

    TestUtils.findRenderedDOMComponentWithClass(header, 'user-dropdown').should.be.ok; // jshint ignore: line

    done();
  });

  it('should render course creation button if user is an instructor', function(done) {
    if ( user.type === 'instructor' ) {
      TestUtils.findRenderedDOMComponentWithClass(header, 'create-course-button').should.be.ok; // jshint ignore: line
    }
    done();
  });

});