'use strict';

var React                  = require('react/addons');
var Reflux                 = require('reflux');
var _                      = require('lodash');
var Link                   = require('react-router').Link;

var CurrentCourseStore     = require('../stores/CurrentCourseStore');
var TimeoutTransitionGroup = require('./TimeoutTransitionGroup.jsx');
var ListLink               = require('./ListLink.jsx');
var ProgressBar            = require('./ProgressBar.jsx');

var Sidebar = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  getInitialState: function() {
    return {
      course: {}
    };
  },

  _onCourseChange: function(err, course) {
    if ( !err ) {
      this.setState({ course: course || {} });
    }
  },

  componentDidMount: function() {
    if ( !_.isEmpty(CurrentCourseStore.course) ) {
      this.setState({ course: CurrentCourseStore.course });
    }

    this.listenTo(CurrentCourseStore, this._onCourseChange);
  },

  renderCourseInfo: function() {
    var element = null;
    var courseTitle;
    var instructorName;

    if ( !_.isEmpty(this.state.course) ) {
      courseTitle = this.state.course.title || '';
      instructorName = this.state.course.instructor ? this.state.course.instructor.fullName : '';
      element = (
        <div className="course-info-container" key={this.state.course.title}>
            <div className="title-container">
              <Link to="Course" params={{ courseId: this.state.course.id }} className="title">{courseTitle}</Link>
              <span>Taught by</span>
              <h4 className="instructor flush">{instructorName}</h4>
            </div>
            <div className="progress-container">
              {this.renderProgressBar()}
            </div>
        </div>
      );
    }

    return element;
  },

  renderProgressBar: function() {
    var element = null;

    if ( !_.isEmpty(this.state.course) && !_.isUndefined(this.state.course.percentageCompleted) ) {
      element = (
        <ProgressBar percentage={this.state.course.percentageCompleted} />
      );
    }

    return element;
  },

  renderCurriculumLink: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <ListLink to="Home">My Curriculum</ListLink>
      );
    }

    return element;
  },

  renderNavigation: function() {
    return (
      <ul>
        {this.renderCurriculumLink()}
        <ListLink to="Explore">Explore Courses</ListLink>
        <ListLink to="Course" params={ {courseId: 1} }>Test Course I</ListLink>
        <ListLink to="Course" params={ {courseId: 2} }>Test Course II</ListLink>
      </ul>
    );
  },

  render: function() {
    return (
      <nav className="sidebar">

        <TimeoutTransitionGroup enterTimeout={500} leaveTimeout={500} transitionName="course-info-container">
          {this.renderCourseInfo()}
        </TimeoutTransitionGroup>

        <div className="links-container">
          {this.renderNavigation()}
        </div>

        <div className="shadow" />

      </nav>
    );
  }

});

module.exports = Sidebar;