/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var Header = React.createClass({

  render: function() {
    return (
      <header>
        <img className="logo" src="../images/logo.png" alt="acadeME logo" />
        <div className="shadow" />
      </header>
    );
  }

});

module.exports = React.createFactory(Header);