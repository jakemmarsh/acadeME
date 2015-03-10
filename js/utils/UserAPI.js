'use strict';

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(identifier) {
    return APIUtils.get('user/' + identifier);
  }

};

module.exports = UserAPI;