/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react');
var _             = require('lodash');

var DocumentTitle = require('../components/DocumentTitle');
var CourseActions = require('../actions/CourseActions');
var TopMenu       = require('../components/TopMenu');

var CoursePage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( _.isEmpty(this.props.course) || this.props.params.courseId !== nextProps.params.courseId ) {
      CourseActions.openCourse(nextProps.params.courseId.toString());
    }
  },

  componentWillMount: function() {
    CourseActions.openCourse(this.props.params.courseId.toString());
  },

  render: function() {
    return (
      <section className="course-page">

        <DocumentTitle title={this.props.course.title} />

        <TopMenu currentUser={this.props.currentUser} course={this.props.course} query={this.props.query.q} />

        <this.props.activeRouteHandler currentUser={this.props.currentUser}
                                       updatePageTitle={this.props.updatePageTitle}
                                       course={this.props.course} />

      </section>
    );
  }

});

module.exports = React.createFactory(CoursePage);