'use strict';

var React               = require('react/addons');
var ReactAsync          = require('react-async');
var Reflux              = require('reflux');
var _                   = require('lodash');
var DocumentTitle       = require('react-document-title');

var PageActions         = require('../actions/PageActions');
var UserCurriculumStore = require('../stores/UserCurriculumStore');
var CourseSnippet       = require('../components/CourseSnippet.jsx');

var HomePage = React.createClass({

  mixins: [ReactAsync.Mixin, Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialStateAsync: function(cb) {
    console.log('get initial state in HomePage.jsx');
    PageActions.openCurriculum(function(courses) {
      cb(null, {
        courses: courses || {}
      });
    });
  },

  _onCoursesChange: function(err, courses) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ courses: courses, error: null });
    }
  },

  componentDidMount: function() {
    this.listenTo(UserCurriculumStore, this._onCoursesChange);
  },

  renderCourses: function() {
    var element = null;

    if ( this.state.courses && this.state.courses.length ) {
      element = _.map(this.state.courses, function(course, index) {
        return (
        <CourseSnippet key={index} course={course} />
        );
      });
    }

    return element;
  },

  render: function() {
    return (
      <DocumentTitle title="My Curriculum">
        <section className="home-page">

          <div className="courses-container soft--sides soft--bottom">
            <h2 className="page-title nudge--top nudge-half--bottom">Enrolled Courses</h2>
            <div className="card">
              {this.renderCourses()}
            </div>
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = HomePage;