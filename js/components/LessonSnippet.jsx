'use strict';

var React = require('react/addons');
var _     = require('lodash');
var Link  = require('react-router').Link;

var cx    = React.addons.classSet;

var LessonSnippet = React.createClass({

  propTypes: {
    lesson: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      lesson: {},
      course: {}
    };
  },

  renderLessonImage: function() {
    var element = null;
    var imageStyles;

    if ( this.props.lesson.imageUrl ) {
      imageStyles = {
        'backgroundImage': 'url(' + this.props.lesson.imageUrl + ')'
      };

      element = (
        <div className="image-container">
          <div className="lesson-image" style={imageStyles} />
        </div>
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'lesson-snippet': true,
      'completed': _.some(this.props.course.lessonsCompleted, function(lessonId) { return lessonId === this.props.lesson.id; })
    });

    return (
      <article className={classes}>

        {this.renderLessonImage()}

        <div className="info-container">
          <Link to="CourseLesson" params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
                                  className="title">
            {this.props.lesson.title}
          </Link>

          <p className="description flush">{this.props.lesson.description}</p>

          <div className="buttons-container soft--top">
            <Link to="CourseLesson" params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
                                    className="button nudge-half--right">
              Read Lesson
            </Link>
            <Link to="LessonQuiz" params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
                                  className="button">
              Take Quiz
            </Link>
          </div>
        </div>

      </article>
    );
  }

});

module.exports = LessonSnippet;