/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('underscore');
var Link  = React.createFactory(require('react-router').Link);

var cx    = React.addons.classSet;

var LessonSnippet = React.createClass({

  propTypes: {
    lesson: React.PropTypes.object,
    course: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      lesson: {},
      course: {}
    };
  },

  render: function() {
    var classes = cx({
      'lesson-snippet': true,
      'completed': this.props.lesson.completed || true // TODO: actual logic for this
    });
    var element = null;

    if ( !_.isEmpty(this.props.course) ) {
      element = (
        <article className={classes}>

          <h2 className="title">{this.props.lesson.title}</h2>

          <p className="description flush">{this.props.lesson.description}</p>

          <div className="buttons-container soft--top">
            <Link to="CourseLesson" params={ {courseId: this.props.course.id, lessonId: this.props.lesson.id} }
                                    className="button nudge-half--right">
              Read Lesson
            </Link>
            <Link to="LessonQuiz" params={ {courseId: this.props.course.id, lessonId: this.props.lesson.id} }
                                  className="button">
              Take Quiz
            </Link>
          </div>

        </article>
      );
    }

    return element;
  }

});

module.exports = React.createFactory(LessonSnippet);