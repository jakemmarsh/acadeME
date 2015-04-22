'use strict';

var React       = require('react/addons');
var TestUtils   = React.addons.TestUtils;
var should      = require('should');
var TestHelpers = require('../../../utils/testHelpers');
var Stub        = require('../../../utils/stubRouterContext.jsx');

describe('Component: Footer', function() {

  var FooterComponent = Stub(require('../../components/Footer.jsx'), { currentUser: TestHelpers.testUser });
  var footer;

  before(function() {
    footer = TestUtils.renderIntoDocument(React.createElement(FooterComponent));
  });

  it('should exist', function(done) {
    should.exist(footer.getDOMNode());
    done();
  });

});