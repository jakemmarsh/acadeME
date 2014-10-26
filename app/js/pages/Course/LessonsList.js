/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');

var LessonSnippet = require('../../components/LessonSnippet');

var CourseLessonsList = React.createClass({

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  renderLessons: function() {
    var elements = null;

    if ( this.props.course && this.props.course.lessons ) {
      elements =  this.props.course.lessons.map(function(lesson, index) {
        return (
          <LessonSnippet courseId={this.props.course.id} lesson={lesson} key={index} />
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

module.exports = CourseLessonsList;