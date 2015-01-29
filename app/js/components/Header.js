/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var _               = require('lodash');
var Link            = React.createFactory(require('react-router').Link);

var LoginModalMixin = require('../mixins/LoginModalMixin');
var UserAvatar      = require('./UserAvatar');
var UserActions     = require('../actions/UserActions');

var Header = React.createClass({

  mixins: [LoginModalMixin],

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

  renderUserOptions: function() {
    var element = null;
    var dropdownContainerClasses = React.addons.classSet({
      'dropdown-container': true,
      'open': this.state.shouldDisplayDropdown
    });

    if ( _.isEmpty(this.props.currentUser) ) {
      element = (
        <div>
          <a onClick={this.toggleLoginModal}>Sign in</a>
        </div>
      );
    } else {
      // TODO: add user avatar next to current user's name
      element = (
        <div className={dropdownContainerClasses} onClick={this.toggleUserDropdown}>
          {this.props.currentUser.name}
          <i className="fa fa-caret-down" />
          {this.renderDropdown()}
        </div>
      );
    }

    return element;
  },

  renderDropdown: function() {
    var element = null;

    if ( this.state.shouldDisplayDropdown ) {
      element = (
        <ul>
          <li>
            <i className="fa fa-sign-out" /> Logout
            <a onClick={UserActions.logout} />
          </li>
        </ul>
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
          {this.renderUserOptions()}
        </div>

        <div className="shadow" />

      </header>
    );
  }

});

module.exports = React.createFactory(Header);