/**
 * @jsx React.DOM
 */
'use strict';

var React    = require('react/addons');

var ListLink = require('./ListLink');

var TopMenu = React.createClass({

  render: function() {
    return (
      <ul className="top-menu">
        <ListLink to="Home">
          <i className="fa fa-book" />
          Lessons
        </ListLink>
        <ListLink to="Home">
          <i className="fa fa-comments" />
          Chat
        </ListLink>
        <li className="search-container" />
      </ul>
    );
  }

});

module.exports = TopMenu;