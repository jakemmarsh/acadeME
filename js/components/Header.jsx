'use strict';

var React           = require('react/addons');
var _               = require('lodash');
var $               = require('jquery');
var Link            = React.createFactory(require('react-router').Link);

var LoginModalMixin = require('../mixins/LoginModalMixin.jsx');
var UserActions     = require('../actions/UserActions');
var UserAvatar      = require('./UserAvatar.jsx');

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
    this.setState({ shouldDisplayDropdown: !this.state.shouldDisplayDropdown }, function() {
      if ( this.state.shouldDisplayDropdown ) {
        $(document).on('click', this.toggleUserDropdown);
      } else {
        $(document).off('click', this.toggleUserDropdown);
      }
    }.bind(this));
  },

  renderCreateCourseButton: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.type === 'instructor' ) {
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
          <Link to="Register" className="nudge-half--right">Register</Link>
          <a onClick={this.toggleLoginModal}>Sign in</a>
        </div>
      );
    } else {
      // TODO: add user avatar next to current user's name
      element = (
        <div className={dropdownContainerClasses} onClick={this.toggleUserDropdown}>
          {this.props.currentUser.fullName}
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
            <a onClick={UserActions.logout.bind(null, null)} />
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
          <Link to="Home"><img className="logo" src="../images/logo.png" alt="acadeME logo" /></Link>
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