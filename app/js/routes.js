/**
 * @jsx React.DOM
 */
'use strict';

var Routes        = require('react-router').Routes;
var Route         = require('react-router').Route;
var NotFoundRoute = require('react-router').NotFoundRoute;
var App           = require('./App');
var HomePage      = require('./pages/HomePage');
var SearchPage    = require('./pages/SearchPage');
var CoursePage    = require('./pages/CoursePage');
var NotFoundPage  = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>
    <Route path='/' handler={App}>
      <Route name='Home' path='/' handler={HomePage} />
      <Route name='Search' path='/search' handler={SearchPage} />
      <Route name='Course' path='/course/:id' handler={CoursePage} />
      <NotFoundRoute handler={NotFoundPage} />
    </Route>
  </Routes>
);