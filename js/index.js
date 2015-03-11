'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Routes   = require('./Routes.jsx');

if ( process.env.NODE_ENV === 'production' ) {
  window.React = React; // Enable React devtools
}

document.addEventListener('DOMContentLoaded', function() {
  Router.run(Routes, Router.HistoryLocation, function (Handler, state) {
    React.render(<Handler params={state.params} query={state.query} />, document.body);
  });
});