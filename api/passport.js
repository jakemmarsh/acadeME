'use strict';

var passport      = require('passport');
var _             = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var models        = require('./models');

/* ====================================================== */

module.exports = function() {

  passport.use(new LocalStrategy(function(username, password, done) {
    models.User.find({
      where: { username: username }
    }).then(function(retrievedUser) {
      if ( !_.isEmpty(retrievedUser) ) {
        retrievedUser.verifyPassword(password, function(err, result) {
          if ( err || !result ) {
            return done(null, false, { message: 'Incorrect password.' });
          } else {
            return done(null, retrievedUser);
          }
        });
      } else {
        return done(null, false, { message: 'User could not be found at that username.' });
      }
    }).catch(function(err) {
      return done(err);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    models.User.find({
      where: { username: username }
    }).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });

};