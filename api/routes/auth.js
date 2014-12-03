'use strict';

var when     = require('when');
var passport = require('passport');
var _        = require('lodash');
var models   = require('../models');

/* ====================================================== */

exports.isAuthenticated = function(req, res, next) {

  if ( req.isAuthenticated() || (req.session && req.session.user) ) {
    return next();
  } else {
    return res.status(401).json({
      error: 'User must be logged in.'
    });
  }

};

/* ====================================================== */

exports.login = function(req, res, next) {

  passport.authenticate('local', function(err, user) {
    if ( err ) {
      return next(err);
    } else if ( _.isEmpty(user) ) {
      return res.status(401).json({
        error: 'Authentication failed.'
      });
    } else {
      req.login(user, function(err) {
        if ( err ) {
          return next(err);
        } else {
          req.session.cookie.maxAge = 1000*60*60*24*7; // seven days
          return res.status(200).json(user);
        }
      });
    }
  })(req, res, next);

};

/* ====================================================== */

exports.register = function(req, res) {

  var createUser = function(user) {
    var deferred = when.defer();

    models.User.create(user).then(function(savedUser) {
      deferred.resolve(savedUser);
    }).catch(function(err) {
      console.log('error creating user:', err);
      deferred.reject({
        status: 500,
        error: err
      });
    });

    return deferred.promise;
  };

  createUser(req.body).then(function(user) {
    res.status(200).json(user);
  }).catch(function(err) {
    res.status(err.status).json({
      error: err.error
    });
  });

};

/* ====================================================== */