/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Spinner = React.createClass({

  render: function() {
    return (
      <div className="spinner" />
    );
  }

});

module.exports = React.createFactory(Spinner);