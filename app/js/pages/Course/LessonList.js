/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var _             = require('lodash');

var LessonSnippet = require('../../components/LessonSnippet');

var CourseLessonList = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  renderLessons: function() {
    var elements = null;

    if ( !this.props.course.lessons || !this.props.course.lessons.length ) {
      elements = (
        <h2 className="text-center nudge--top">The instructor has not added any lessons to this course yet!</h2>
      );
    } else if ( !_.isEmpty(this.props.course) && this.props.course.lessons ) {
      elements =  this.props.course.lessons.map(function(lesson, index) {
        return (
          <LessonSnippet course={this.props.course} lesson={lesson} key={index} />
        );
      }.bind(this));
    }

    return elements;
  },

  render: function() {
    return (
      <div>
        {this.renderLessons()}
      </div>
    );
  }

});

module.exports = React.createFactory(CourseLessonList);