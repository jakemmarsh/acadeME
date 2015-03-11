'use strict';

var React                  = require('react/addons');
var _                      = require('lodash');
var Link                   = require('react-router').Link;

var TimeoutTransitionGroup = require('./TimeoutTransitionGroup.jsx');
var ListLink               = require('./ListLink.jsx');
var ProgressBar            = require('./ProgressBar.jsx');

var Sidebar = React.createClass({

  propTypes: {
    course: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
        course: {}
    };
  },

  getInitialState: function() {
    return {
      displayCourseInfo: true
    };
  },

  renderCourseInfo: function() {
    var element = null;
    var courseTitle;
    var instructorName;

    if ( !_.isEmpty(this.props.course) ) {
      courseTitle = this.props.course.title || '';
      instructorName = this.props.course.instructor ? this.props.course.instructor.fullName : '';
      element = (
        <div className="course-info-container" key={this.props.course.title}>
            <div className="title-container">
              <Link to="Course" params={{ courseId: this.props.course.id }} className="title">{courseTitle}</Link>
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

    if ( !_.isEmpty(this.props.course) && this.props.course.percentageComplete ) {
      element = (
        <ProgressBar percentage={this.props.course.percentageComplete} />
      );
    }

    return element;
  },

  renderNavigation: function() {
    return (
      <ul>
        <ListLink to="Home">My Curriculum</ListLink>
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