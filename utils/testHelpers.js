'use strict';

var _              = require('lodash');
var Router         = require('react-router');
var React          = require('react/addons');
var TestUtils      = React.addons.TestUtils;
var TestLocation   = require('react-router/lib/locations/TestLocation');

module.exports = {

  testUser: {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    type: 'instructor',
    imageUrl: null
  },

  testPage: function(initialPath, targetComponent, steps) {
    var router = Router.create({
      routes: require('../js/Routes.jsx'),
      location: new TestLocation([initialPath])
    });
    var routerMainComponent;
    var step;

    if ( !_.isArray(steps) ) {
      steps = [steps];
    }

    router.run(function (Handler, state) {
      step = steps.shift();

      routerMainComponent = TestUtils.renderIntoDocument(
        <Handler params={state.params} query={state.query} />
      );

      step(TestUtils.findRenderedComponentWithType(routerMainComponent, targetComponent));
    }.bind(this));
  },

  createNativeClickEvent: function() {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', false, true);

    return evt;
  },

  createNativeMouseEvent: function(options) {
    var evt = document.createEvent('MouseEvents');
    evt.initEvent(options.action, false, true);

    return evt;
  },

  createNativeKeyboardEvent: function(options) {
    var evt = document.createEvent('HTMLEvents');
    var keyEvent = options.event || 'keyup';
    evt.which = options.which;
    evt.keycode = options.which;
    evt.initEvent(keyEvent, false, true);

    return evt;
  },

  noop: function() {},

  keyCodes: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    COMMA: 188,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18
  },

  simulateRouterLinkClick: function(linkComponent) {
    TestUtils.Simulate.click(linkComponent, {button: 0});
  },

  scryRenderedDOMComponentsWithProp: function scryRenderedDOMComponentsWithProp(root, propName, propValue) {
    return TestUtils.findAllInRenderedTree(root, function(inst) {
      var instancePropValue = inst.props[propName];

      return (
        TestUtils.isDOMComponent(inst)
        && instancePropValue
        && (' ' + instancePropValue + ' ').indexOf(' ' + propValue + ' ') !== -1
      );
    });
  },

  findRenderedDOMComponentWithProp: function findRenderedDOMComponentWithProp(root, propName, propValue) {
    var all = this.scryRenderedDOMComponentsWithProp(root, propName, propValue);

    if (all.length !== 1) {
      throw new Error('Did not find exactly one match (found: ' + all.length + ') for prop  ' + propName + ' : ' + propValue);
    }

    return all[0];
  }

};