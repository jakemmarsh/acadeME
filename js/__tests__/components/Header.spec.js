'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;
var should    = require('should');
var Stub      = require('../../../utils/stubRouterContext.jsx');

describe('Header', function() {

  var HeaderComponent = Stub(require('../../components/Header.jsx'));
  var header;

  beforeEach(function() {
    header = TestUtils.renderIntoDocument(
      <HeaderComponent currentUser={{}} />
    );
  });

  it('should exist', function(done) {
    should.exist(header.getDOMNode());
    done();
  });

});