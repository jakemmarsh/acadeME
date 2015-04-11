'use strict';

var passport      = require('passport');
var _             = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var models        = require('./models');

/* ====================================================== */

module.exports = function() {

  passport.use(new LocalStrategy({ usernameField: 'email' }, function(username, password, done) {
    models.User.find({
      where: { email: username },
      include: [models.Course]
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
        return done(null, false, { message: 'No user could be found with that email.' });
      }
    }).catch(function(err) {
      return done(err);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    models.User.find({
      where: { email: email }
    }).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });

};