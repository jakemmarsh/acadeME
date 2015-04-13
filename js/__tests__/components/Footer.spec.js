'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;
var should    = require('should');
var Stub      = require('../../../spec/support/stubRouterContext.jsx');

describe('Footer', function() {

  var FooterComponent = Stub(require('../../components/Footer.jsx'));
  var footer;

  beforeEach(function() {
    footer = TestUtils.renderIntoDocument(
      <FooterComponent />
    );
  });

  it('should exist', function(done) {
    should.exist(footer.getDOMNode());
    done();
  });

});