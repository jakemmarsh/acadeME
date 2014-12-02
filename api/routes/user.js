'use strict';

var when   = require('when');
var _      = require('lodash');
var models = require('../models');

/* ====================================================== */

exports.get = function(req, res) {

  var getUser = function(identifier) {
    var deferred = when.defer();
    var query = { id: identifier };

    if ( isNaN(parseInt(identifier)) ) {
      query = { username: identifier };
    }

    models.User.find({
      where: query,
      include: [models.Playlist]
    }).then(function(user) {
      if ( _.isEmpty(user) ) {
        deferred.reject({
          status: 404,
          body: 'User could not be found at identifier: ' + identifier
        });
      } else {
        deferred.resolve(user);
      }
    }).catch(function(err) {
      deferred.reject({
        status: 500,
        body: err
      });
    });

    return deferred.promise;
  };

  getUser(req.params.identifier).then(function(user) {
    res.status(200).json(user);
  }, function(err) {
    res.status(err.status).json({
      error: err.body
    });
  });

};