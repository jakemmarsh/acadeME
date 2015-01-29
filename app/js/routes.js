/**
 * @jsx React.DOM
 */
'use strict';

var Route            = require('react-router').Route;
var DefaultRoute     = require('react-router').DefaultRoute;
var NotFoundRoute    = require('react-router').NotFoundRoute;

var App              = require('./App');

var HomePage         = require('./pages/HomePage');
var RegisterPage     = require('./pages/RegisterPage');
var ExplorePage      = require('./pages/ExplorePage');
var CreateCoursePage = require('./pages/CreateCoursePage');
var CoursePage       = require('./pages/CoursePage');
var CourseLessonList = require('./pages/Course/LessonList');
var CourseLesson     = require('./pages/Course/Lesson');
var LessonQuiz       = require('./pages/Course/Quiz');
var CourseSearch     = require('./pages/Course/Search');
var CourseChat       = require('./pages/Course/Chat');
var CreateLesson     = require('./pages/Course/CreateLesson');
var NotFoundPage     = require('./pages/NotFoundPage');

module.exports = (
  <Route path='/' handler={App}>

    <DefaultRoute handler={HomePage} />

    <Route name='Home' path='/' handler={HomePage} />

    <Route name='Register' path='/register' handler={RegisterPage} />

    <Route name='Explore' path='/explore' handler={ExplorePage} />

    <Route name='CreateCourse' path='/create' handler={CreateCoursePage} />

    <Route name='Course' path='/course/:courseId' handler={CoursePage}>
      <DefaultRoute handler={CourseLessonList} />
      <Route name='CourseLesson' path='/course/:courseId/lesson/:lessonId' handler={CourseLesson} />
      <Route name='LessonQuiz' path='/course/:courseId/lesson/:lessonId/quiz' handler={LessonQuiz} />
      <Route name='CourseSearch' path='/course/:courseId/search' handler={CourseSearch} />
      <Route name='CourseChat' path='/course/:courseId/chat' handler={CourseChat} />
      <Route name='CreateLesson' path='/course/:courseId/create' handler={CreateLesson} />
    </Route>

    <NotFoundRoute handler={NotFoundPage} />

  </Route>
);