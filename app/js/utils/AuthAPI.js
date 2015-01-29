'use strict';

var APIUtils = require('./APIUtils');

var AuthAPI = {

  check: function() {
    return APIUtils.get('auth/check');

    // deferred.resolve({
    //   id: 4,
    //   username: 'jakemmarsh',
    //   name: 'Jake Marsh',
    //   type: 'instructor',
    //   imageUrl: 'https://scontent-b-lga.xx.fbcdn.net/hphotos-xpf1/t31.0-8/1796992_10151957242618173_179336983_o.jpg'
    // });
  },

  register: function(user) {
    return APIUtils.post('auth/register', user);
  },

  login: function(user) {
    return APIUtils.post('auth/login', user);
  },

  logout: function() {
    return APIUtils.post('auth/logout');
  }

};

module.exports = AuthAPI;