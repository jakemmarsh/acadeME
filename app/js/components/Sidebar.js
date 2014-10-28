/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var _           = require('underscore');

var ListLink    = require('./ListLink');
var ProgressBar = require('./ProgressBar');

var cx          = React.addons.classSet;

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

  toggleCourse: function() {
    this.setState({
      displayCourseInfo: !this.state.displayCourseInfo
    });
  },

  renderProgressBar: function() {
    var element = null;

    if ( this.props.course && this.props.course.percentageComplete ) {
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
        <ListLink to="Course" params={ {courseId: 0} }>Test Course</ListLink>
      </ul>
    );
  },

  render: function() {
    var courseInfoContainerClasses = cx({
      'course-info-container': true,
      'open': !_.isEmpty(this.props.course)
    });
    var courseTitle = this.props.course ? this.props.course.title : '';
    var instructorName = this.props.course && this.props.course.instructor ? this.props.course.instructor.name : '';

    return (
      <nav className="sidebar">
        <div className={courseInfoContainerClasses}>
          <div className="title-container">
            <h3 className="title">{courseTitle}</h3>
            <span>Taught by</span>
            <h4 className="instructor flush">{instructorName}</h4>
          </div>
          <div className="progress-container">
            {this.renderProgressBar()}
          </div>
        </div>
        <div className="links-container">
          {this.renderNavigation()}
        </div>
        <div className="shadow" />
      </nav>
    );
  }

});

module.exports = Sidebar;