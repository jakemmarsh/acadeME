'use strict';

var when   = require('when');
var bcrypt = require('bcrypt');
var models = require('../models');

/* ====================================================== */

exports.login = function(req, res) {

  var loginUser = function(credentials) {
    var deferred = when.defer();

    models.User.find({ username: credentials.username }).then(function(retrievedUser) {
      console.log('retrieved user:', retrievedUser);
      bcrypt.compare(credentials.password, retrievedUser.hash, function(err, result) {
        if ( err || !result ) {
          deferred.reject({
            status: 403,
            body: err || 'Password is incorrect.'
          });
        } else {
          deferred.resolve(retrievedUser);
        }
      });
    }).catch(function(err) {
      deferred.reject(500, err);
    });

    return deferred.promise;
  };

  loginUser(req.body).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};

/* ====================================================== */

exports.register = function(req, res) {

  var createUser = function(user) {
    var deferred = when.defer();

    bcrypt.hash(user.password, 10, function(err, hash) {
      if ( err ) {
        deferred.reject({
          status: 500,
          body: err
        });
      } else {
        user.hash = hash;

        console.log('about to create user:', user);

        models.User.create(user).then(function(savedUser) {
          deferred.resolve(savedUser);
        }).catch(function(err) {
          console.log('error creating user:', err);
          deferred.reject({
            status: 500,
            body: err
          });
        });
      }
    });

    return deferred.promise;
  };

  createUser(req.body).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};