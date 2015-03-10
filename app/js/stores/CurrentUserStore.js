'use strict';

var Reflux      = require('reflux');

var UserActions = require('../actions/UserActions');
var AuthAPI     = require('../utils/AuthAPI');

var CurrentTrackStore = Reflux.createStore({

  init: function() {
    this.user = null;

    this.listenTo(UserActions.check, this.checkLoginStatus);
    this.listenTo(UserActions.login, this.loginUser);
    this.listenTo(UserActions.logout, this.logoutUser);
  },

  checkLoginStatus: function(cb) {
    cb = cb || function() {};

    AuthAPI.check().then(function(user) {
      console.log('checked:', user);
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      console.log('error checking login status:', err);
    }.bind(this));
  },

  loginUser: function(user, cb) {
    cb = cb || function() {};

    console.log('login user');

    AuthAPI.login(user).then(function(user) {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  logoutUser: function(cb) {
    cb = cb || function() {};

    console.log('logout user');

    AuthAPI.logout(this.user).then(function() {
      this.user = null;
      cb(null, null);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
      console.log('error logging out:', err);
    });
  }

});

module.exports = CurrentTrackStore;