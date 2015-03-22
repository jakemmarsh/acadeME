'use strict';

var React            = require('react/addons');
var Route            = require('react-router').Route;
var DefaultRoute     = require('react-router').DefaultRoute;
var NotFoundRoute    = require('react-router').NotFoundRoute;

var App              = require('./App.jsx');

var CurriculumPage   = require('./pages/CurriculumPage.jsx');
var RegisterPage     = require('./pages/RegisterPage.jsx');
var ExplorePage      = require('./pages/ExplorePage.jsx');
var CreateCoursePage = require('./pages/CreateCoursePage.jsx');
var CoursePage       = require('./pages/CoursePage.jsx');
var CourseLessonList = require('./pages/Course/LessonList.jsx');
var CourseLesson     = require('./pages/Course/Lesson.jsx');
var LessonQuiz       = require('./pages/Course/Quiz.jsx');
var CourseSearch     = require('./pages/Course/Search.jsx');
var CourseChat       = require('./pages/Course/Chat.jsx');
var CreateLesson     = require('./pages/Course/CreateLesson.jsx');
var CreateQuiz       = require('./pages/Course/CreateQuiz.jsx');
var NotFoundPage     = require('./pages/NotFoundPage.jsx');

module.exports = (
  <Route path='/' handler={App}>

    <DefaultRoute handler={ExplorePage} />

    <Route name='Home' path='/' handler={CurriculumPage} />

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
      <Route name='CreateQuiz' path='/course/:courseId/lesson/:lessonId/quiz/create' handler={CreateQuiz} />
    </Route>

    <NotFoundRoute handler={NotFoundPage} />

  </Route>
);