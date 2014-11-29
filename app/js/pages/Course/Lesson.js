/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var _                  = require('underscore');
var marked             = require('react-marked');
var Link               = React.createFactory(require('react-router').Link);

var CurrentLessonStore = require('../../stores/CurrentLessonStore');
var LessonActions      = require('../../actions/LessonActions');

var CourseLesson = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    lesson: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      currentUser: {},
      lesson: {}
    };
  },

  _onLessonChange: function(lesson) {
    this.setState({
      lesson: lesson
    });
  },

  componentWillMount: function() {
    LessonActions.openLesson(this.props.params.lessonId.toString());
  },

  componentDidMount: function() {
    this.listenTo(CurrentLessonStore, this._onLessonChange);
  },

  renderLessonBody: function() {
    return _.map(this.state.lesson.bodyElements, function(element) {
      return marked(element);
    });
  },

  renderQuizLink: function() {
    var element = null;

    // TODO: check if
    if ( !_.isEmpty(this.state.lesson) ) {
      element = (
        <Link to="LessonQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.state.lesson.id }}
              className="button">
          Take Quiz
        </Link>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>
        <h2 className="nudge nudge-half--bottom">{this.state.lesson.title}</h2>
        <div className="lesson islet nudge flush--top">
          {this.renderLessonBody()}
          {this.renderQuizLink()}
        </div>
      </div>
    );
  }

});

module.exports = React.createFactory(CourseLesson);