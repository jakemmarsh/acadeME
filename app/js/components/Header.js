/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var Link       = React.createFactory(require('react-router').Link);

var UserAvatar = require('./UserAvatar');

var Header = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialState: function() {
    return {
      shouldDisplayDropdown: false
    };
  },

  toggleUserDropdown: function() {
    this.setState({ shouldDisplayDropdown: !this.state.shouldDisplayDropdown });
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

  renderUserDropdown: function() {
    var element = null;

    if ( this.state.shouldDisplayDropdown ) {
      element = (
        <ul>
          <li>
            <i className="fa fa-sign-out" /> Logout
            <Link to="Explore" />
          </li>
        </ul>
      );
    }

    return element;
  },

  render: function() {
    var dropdownContainerClasses = React.addons.classSet({
      'dropdown-container': true,
      'open': this.state.shouldDisplayDropdown
    });

    // TODO: add user avatar next to current user's name
    return (
      <header>

        <div className="left-container">
          {this.renderCreateCourseButton()}
        </div>

        <div className="logo-container">
          <img className="logo" src="../images/logo.png" alt="acadeME logo" />
        </div>

        <div className="right-container">
          <div className={dropdownContainerClasses} onClick={this.toggleUserDropdown}>
            {this.props.currentUser.name}
            <i className="fa fa-caret-down" />
            {this.renderUserDropdown()}
          </div>
        </div>

        <div className="shadow" />

      </header>
    );
  }

});

module.exports = React.createFactory(Header);