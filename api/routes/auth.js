'use strict';

var when     = require('when');
var passport = require('passport');
var _        = require('lodash');
var models   = require('../models');

/* ====================================================== */

exports.isAuthenticated = function(req, res, next) {

  console.log('req user:', req.user);

  if ( req.user || req.isAuthenticated() || (req.session && req.session.user) ) {
    return next();
  } else {
    return res.status(401).json({ status: 401, message: 'User must be logged in.' });
  }

};

/* ====================================================== */

exports.login = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if ( err ) {
      return next(err);
    } else if ( _.isEmpty(user) ) {
      return res.status(401).json({ status: 401, message: info.message || 'Authentication failed.' });
    } else {
      req.login(user, function(err) {
        if ( err ) {
          return next(err);
        } else {
          req.session.cookie.maxAge = 1000*60*60*24*7*4; // four weeks
          return res.status(200).json(user);
        }
      });
    }
  })(req, res, next);

};

/* ====================================================== */

exports.register = function(req, res) {

  var checkEmail = function(user) {
    var deferred = when.defer();
    var email = user.email || user.Email;

    models.User.find({
      where: { email: email }
    }).then(function(retrievedUser) {
      if ( !_.isEmpty(retrievedUser) ) {
        deferred.reject({ status: 400, body: 'That email address is already registered.' });
      } else {
        deferred.resolve(user);
      }
    });

    return deferred.promise;
  };

  var createUser = function(user) {
    var deferred = when.defer();
    var newUser = {
      email: user.email || user.Email,
      firstName: user.firstName || user.FirstName,
      lastName: user.lastName || user.LastName,
      hash: user.password || user.Password || user.hash || user.Hash
    };

    models.User.create(newUser).then(function(savedUser) {
      deferred.resolve(savedUser);
    }).catch(function(err) {
      console.log('error creating user:', err);
      deferred.reject({ status: 500, body: err });
    });

    return deferred.promise;
  };

  checkEmail(req.body)
  .then(createUser)
  .then(function(user) {
    res.status(200).json(user);
  }).catch(function(err) {
    res.status(err.status).json({ status: err.status, error: err.body });
  });

};

/* ====================================================== */

exports.logout = function(req, res) {

  req.logout();
  res.status(200).json({ status: 200, message: 'User successfully logged out.' });

};