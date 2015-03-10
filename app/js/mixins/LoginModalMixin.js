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
      email: '',
      password: ''
    };
  },

  toggleLoginModal: function() {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  },

  handleSubmit: function(evt) {
    var user = {
      email: this.state.email,
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
        this.setState(this.getInitialState());
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
        <div className="error-container nudge-quarter--bottom">
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
        <Modal className="login-modal" title="Login" onRequestClose={this.toggleLoginModal}>

          <div className="table full-width">
            <div className="login-container td half-width island">
              <form id="login-form" onSubmit={this.handleSubmit}>
                <input type="text"
                       id="email"
                       className="nudge-quarter--bottom"
                       valueLink={this.linkState('email')}
                       placeholder="Email Address"
                       required />
                <input type="password"
                       id="password"
                       className="nudge--bottom"
                       valueLink={this.linkState('password')}
                       placeholder="Password"
                       required />
                {this.renderError()}
                <div className="table full-width">
                  <div className="td half-width text-left">
                    <a>Forgot your password?</a>
                  </div>
                  <div className="td half-width text-right">
                    <input type="submit" className="btn" value="Login" />
                  </div>
                </div>
              </form>
            </div>

            <div className="register-container td half-width island text-center">
              <h3 className="primary">Don't have an account?</h3>
              <a href="/register" className="btn soft-half--ends soft--sides inline-block">Sign up</a>
            </div>
          </div>

        </Modal>
      );
    }

    return element;
  },

};

module.exports = LoginModalMixin;