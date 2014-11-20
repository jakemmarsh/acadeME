/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var ReactCSSTransitionGroup = React.createFactory(React.addons.CSSTransitionGroup);
var _                       = require('underscore');

var ListLink                = require('./ListLink');
var ProgressBar             = require('./ProgressBar');

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
    var element = [];
    var courseTitle;
    var instructorName;

    if ( !_.isEmpty(this.props.course) ) {
      courseTitle = this.props.course.title || '';
      instructorName = this.props.course.instructor ? this.props.course.instructor.name : '';
      element = (
        <div className="course-info-container" key={this.props.course.title}>
            <div className="title-container">
              <h3 className="title">{courseTitle}</h3>
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
        <ListLink to="Course" params={ {courseId: 0} }>Test Course</ListLink>
      </ul>
    );
  },

  render: function() {
    return (
      <nav className="sidebar">

        <ReactCSSTransitionGroup transitionName="course-info-container" component="div">
          {this.renderCourseInfo()}
        </ReactCSSTransitionGroup>

        <div className="links-container">
          {this.renderNavigation()}
        </div>

        <div className="shadow" />

      </nav>
    );
  }

});

module.exports = React.createFactory(Sidebar);