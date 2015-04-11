'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Stub      = require('../../../spec/support/stubRouterContext.jsx');

jest.dontMock('../../components/Header.jsx');

describe('Header', function() {

  var HeaderComponent = Stub(require('../../components/Header.jsx'));
  var header;

  beforeEach(function() {
    header = TestUtils.renderIntoDocument(
      <HeaderComponent currentUser={{}} />
    );
  });

  it('should exist', function() {
    expect(header.getDOMNode()).toBeDefined();
  });

});