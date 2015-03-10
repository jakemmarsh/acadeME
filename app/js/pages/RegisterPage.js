/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var _             = require('lodash');
var when          = require('when');
var Navigation    = require('react-router').Navigation;

var AuthAPI       = require('../utils/AuthAPI');
var awsAPI        = require('../utils/awsAPI');
var UserActions   = require('../actions/UserActions');
var DocumentTitle = require('../components/DocumentTitle');
var FileInput     = require('../components/FileInput');

var RegisterPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      loading: false,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      image: null,
      submitDisabled: true
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( this.isMounted() && !_.isEmpty(nextProps.currentUser) ) {
      this.replaceWith('Home');
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) && this.isMounted() ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var passwordSatisfied = this.state.password.length && this.state.confirmPassword.length;
    var formIsValid = this.state.email.length && this.state.firstName.length && this.state.lastName.length && passwordSatisfied;

    this.setState({ submitDisabled: !formIsValid });
  },

  updateImage: function(file) {
    this.setState({ image: file });
  },

  createUser: function() {
    var deferred = when.defer();
    var user = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password
    };

    AuthAPI.register(user).then(function(createdUser) {
      deferred.resolve(createdUser);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  uploadImage: function(user) {
    var deferred = when.defer();

    if ( this.state.image ) {
      awsAPI.uploadUserImage(this.state.image, user.id);
    }

    deferred.resolve(user);

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    var passwordsMatch = this.state.password.length && this.state.password === this.state.confirmPassword;

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    if ( !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else {
      this.setState({ error: null, loading: true });

      this.createUser().then(this.uploadImage).then(function(user) {
        console.log('successfully registerd user, transitioning to home page');
        UserActions.set(user);
        this.transitionTo('Home');
      }.bind(this)).catch(function(err) {
        console.log('error registering:', err);
        this.setState({ loading: false, error: err.message || err });
      }.bind(this));
    }
  },

  renderError: function() {
    var element = null;

    if ( this.state.error ) {
      element = (
        <div className="error-container nudge--bottom">
          {this.state.error}
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="register-page">

        <DocumentTitle title="Register" />

        <div className="form-container">
          <h3 className="text-center">Register for acadeME</h3>
          <form id="register-form" onSubmit={this.handleSubmit}>
            <input type="email"
                   id="email"
                   className="nudge-half--bottom"
                   valueLink={this.linkState('email')}
                   placeholder="Email"
                   required />
            <input type="text"
                   id="firstName"
                   className="nudge-half--bottom"
                   valueLink={this.linkState('firstName')}
                   placeholder="First Name"
                   required />
            <input type="text"
                   id="lastName"
                   className="nudge-half--bottom"
                   valueLink={this.linkState('lastName')}
                   placeholder="Last Name"
                   required />
            <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
            <input type="password"
                   id="password"
                   className="nudge-half--bottom"
                   valueLink={this.linkState('password')}
                   placeholder="Password"
                   required />
            <input type="password"
                   id="confirmPassword"
                   className="nudge--bottom"
                   valueLink={this.linkState('confirmPassword')}
                   placeholder="Confirm Password"
                   required />
            {this.renderError()}
            <input type="submit"
                   className="btn block full-width"
                   value="Register"
                   disabled={this.state.loading || this.state.submitDisabled ? 'true' : ''} />
          </form>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(RegisterPage);