/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react');

var CourseActions = require('../actions/CourseActions');
var TopMenu       = require('../components/TopMenu');

var CoursePage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired,
    updatePageTitle: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  componentWillMount: function() {
    CourseActions.openCourse(this.props.params.courseId.toString(), function() {
      this.props.updatePageTitle(this.props.course.title);
    }.bind(this));
  },

  render: function() {
    return (
      <section className="course-page">

        <TopMenu course={this.props.course} query={this.props.query.q} />

        <this.props.activeRouteHandler currentUser={this.props.currentUser}
                                       updatePageTitle={this.props.updatePageTitle}
                                       course={this.props.course} />

      </section>
    );
  }

});

module.exports = React.createFactory(CoursePage);