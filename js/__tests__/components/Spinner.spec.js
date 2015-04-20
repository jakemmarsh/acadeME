'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;
var should    = require('should');
var Stub      = require('../../../utils/stubRouterContext.jsx');

describe('Component: Spinner', function() {

  var SpinnerComponent = Stub(require('../../components/Spinner.jsx'));

  it('should exist if loading is true', function(done) {
    var spinner = TestUtils.renderIntoDocument(
      <SpinnerComponent loading={true} />
    );

    (spinner === null).should.be.false; // jshint ignore:line

    done();
  });

  it('should not exist if loading is false', function(done) {
    var spinner = TestUtils.renderIntoDocument(
      <SpinnerComponent loading={false} />
    );

    should.not.exist(spinner.getDOMNode());

    done();
  });

});