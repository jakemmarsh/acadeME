'use strict';

var path    = require('path');
var express = require('express');
var api     = express();
//var routes  = require(path.join(__dirname, 'routes'));

/* ====================================================== */

// Auth endpoints
//api.put('/register', routes.auth.register);
//api.post('/login', routes.auth.login);

/* ====================================================== */

// User endpoints
//api.get('/user/:identifier', routes.user.get);

/* ====================================================== */

module.exports = api;