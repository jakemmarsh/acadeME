/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Header = React.createClass({

  render: function() {
    return (
      <header>
        Header
        <div className="shadow" />
      </header>
    );
  }

});

module.exports = React.createFactory(Header);