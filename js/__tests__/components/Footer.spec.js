'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Stub      = require('../../../spec/support/stubRouterContext.jsx');

jest.dontMock('../../components/Footer.jsx');

describe('Footer', function() {

  var FooterComponent = Stub(require('../../components/Footer.jsx'));
  var footer;

  beforeEach(function() {
    footer = TestUtils.renderIntoDocument(
      <FooterComponent />
    );
  });

  it('should exist', function() {
    expect(footer.getDOMNode()).toBeDefined();
  });

});