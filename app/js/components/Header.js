/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var Header = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  renderCreateCourseButton: function() {
    var element = null;

    if ( this.props.currentUser.type === 'instructor' ) {
      element = (
        <Link to="CreateCourse" className="create-course-button">
          <i className="fa fa-plus" />
        </Link>
      );
    }

    return element;
  },

  render: function() {
    return (
      <header>

        <div className="left-container">
          {this.renderCreateCourseButton()}
        </div>

        <div className="logo-container">
          <img className="logo" src="../images/logo.png" alt="acadeME logo" />
        </div>

        <div className="right-container">
          <div className="dropdown-container">
            {this.props.currentUser.name}
            <i className="fa fa-caret-down" />
          </div>
        </div>

        <div className="shadow" />

      </header>
    );
  }

});

module.exports = React.createFactory(Header);