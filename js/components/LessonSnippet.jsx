'use strict';

var React = require('react/addons');
var _     = require('lodash');
var Link  = require('react-router').Link;

var cx    = React.addons.classSet;

var LessonSnippet = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    lesson: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
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

  renderQuizButton: function() {
    var element = null;
    var userIsInstructor = !_.isEmpty(this.props.currentUser) && this.props.course.instructorId === this.props.currentUser.id;
    var quizExists = this.props.lesson.quiz && _.isNumber(this.props.lesson.quiz.id);

    console.log('current user id:', this.props.currentUser.id);
    console.log('course instructor id:', this.props.course.instructorId);
    console.log('user is instructor:', userIsInstructor);

    if ( userIsInstructor && !quizExists ) {
      element = (
        <Link to="CreateQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
              className="button highlight">
          Create Quiz
        </Link>
      );
    } else if ( quizExists && !userIsInstructor ) {
      element = (
        <Link to="LessonQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
              className="button">
          Take Quiz
        </Link>
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
          <Link to="CourseLesson"
                params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
                className="title">
            {this.props.lesson.title}
          </Link>

          <p className="description flush">{this.props.lesson.description}</p>

          <div className="buttons-container soft--top">
            <Link to="CourseLesson"
                  params={{ courseId: this.props.course.id, lessonId: this.props.lesson.id }}
                  className="button nudge-half--right">
              Read Lesson
            </Link>
            {this.renderQuizButton()}
          </div>
        </div>

      </article>
    );
  }

});

module.exports = LessonSnippet;