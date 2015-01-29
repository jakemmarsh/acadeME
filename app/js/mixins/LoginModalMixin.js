/**
 * @jsx React.DOM
 */
'use strict';

var React                 = require('react/addons');
var Reflux                = require('reflux');

var UserActions           = require('../actions/UserActions');
var LayeredComponentMixin = require('./LayeredComponentMixin');
var Modal                 = require('../components/Modal');
var Spinner               = require('../components/Spinner');

var LoginModalMixin = {

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, LayeredComponentMixin],

  getInitialState: function() {
    return {
      showLoginModal: false,
      loading: false,
      username: '',
      password: ''
    };
  },

  toggleLoginModal: function() {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  },

  handleSubmit: function(evt) {
    var user = {
      username: this.state.username,
      password: this.state.password
    };

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    this.setState({ loading: true });

    UserActions.login(user, function(err) {
      if ( err ) {
        console.log('error logging in:', err);
        this.setState({ error: err.message, loading: false });
      } else {
        console.log('successfully logged in, closing modal');
        this.toggleLoginModal();
      }
    }.bind(this));
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={10} />
      );
    }

    return element;
  },

  renderError: function() {
    var element = null;

    if ( this.state.error ) {
      element = (
        <div className="error-container">
          {this.state.error}
        </div>
      );
    }

    return element;
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showLoginModal ) {
      element = (
        <Modal className="login-modal" onRequestClose={this.toggleLoginModal}>

          <form id="login-form" className="island" onSubmit={this.handleSubmit}>
            <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
            <br />
            <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
            <br />
            {this.renderError()}
            <br />
            <input type="submit" value="Login" />
          </form>

          <div className="text-center nudge-half--top">
            <a>Forgot your password?</a>
          </div>

          <div className="text-center nudge-quarter--top">
            Don't have an account? <a href="/register">Sign up</a>
          </div>

        </Modal>
      );
    }

    return element;
  },

};

module.exports = LoginModalMixin;