'use strict';

/**
 * From https://github.com/rackt/react-router/blob/master/docs/guides/testing.md
 *
 *   var stubRouterContext = require('./stubRouterContext');
 *   var IndividualComponent = require('./IndividualComponent');
 *   var Subject = stubRouterContext(IndividualComponent, {someProp: 'foo'});
 *   React.render(<Subject/>, testElement);
 */

var React = require('react');

// Polyfill Object Assign
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

var stubRouterContext = function(Component, props, stubs) {
  return React.createClass({
    childContextTypes: {
      makePath: React.PropTypes.func,
      makeHref: React.PropTypes.func,
      transitionTo: React.PropTypes.func,
      replaceWith: React.PropTypes.func,
      goBack: React.PropTypes.func,
      getCurrentPath: React.PropTypes.func,
      getCurrentRoutes: React.PropTypes.func,
      getCurrentPathname: React.PropTypes.func,
      getCurrentParams: React.PropTypes.func,
      getCurrentQuery: React.PropTypes.func,
      isActive: React.PropTypes.func
    },

    getChildContext: function() {
      return Object.assign({
        makePath: function() {},
        makeHref: function() {},
        transitionTo: function() {},
        replaceWith: function() {},
        goBack: function() {},
        getCurrentPath: function() {},
        getCurrentRoutes: function() {},
        getCurrentPathname: function() {},
        getCurrentParams: function() {},
        getCurrentQuery: function() {},
        isActive: function() {}
      }, stubs);
    },

    render: function() {
      // return <Home/>;
      return <Component {...props}/>;
    }
  });
};

module.exports = stubRouterContext;