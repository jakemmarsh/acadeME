/**
 * @jsx React.DOM
 */
'use strict';

var Routes            = require('react-router').Routes;
var Route             = require('react-router').Route;
var DefaultRoute      = require('react-router').DefaultRoute;
var NotFoundRoute     = require('react-router').NotFoundRoute;

var App               = require('./App');

var HomePage          = require('./pages/HomePage');

var ExplorePage       = require('./pages/ExplorePage');

var CoursePage        = require('./pages/CoursePage');
var CourseLessonsList = require('./pages/Course/LessonsList');
var CourseLesson      = require('./pages/Course/Lesson');
var LessonQuiz        = require('./pages/Course/Quiz');
var CourseSearch      = require('./pages/Course/Search');
var CourseChat        = require('./pages/Course/Chat');

var NotFoundPage      = require('./pages/NotFoundPage');

module.exports = (
  <Routes location='history'>

    <Route path='/' handler={App}>
      <DefaultRoute handler={HomePage} />

      <Route name='Home' path='/' handler={HomePage} />

      <Route name='Explore' path='/explore' handler={ExplorePage} />

      <Route name='Course' path='/course/:courseId' handler={CoursePage}>
        <DefaultRoute handler={CourseLessonsList} />
        <Route name='CourseLesson' path='/course/:courseId/lesson/:lessonId' handler={CourseLesson} />
        <Route name='LessonQuiz' path='/course/:courseId/lesson/:lessonId/quiz' handler={LessonQuiz} />
        <Route name='CourseSearch' path='/course/:courseId/search' handler={CourseSearch} />
        <Route name='CourseChat' path='/course/:courseId/chat' handler={CourseChat} />
      </Route>

      <NotFoundRoute handler={NotFoundPage} />
    </Route>

  </Routes>
);