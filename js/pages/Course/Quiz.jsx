'use strict';

var React            = require('react/addons');
var ReactAsync       = require('react-async');
var Reflux           = require('reflux');

var QuizActions      = require('../../actions/QuizActions');
var CurrentQuizStore = require('../../stores/CurrentQuizStore');
var LessonActions    = require('../../actions/LessonActions');
var Quiz             = require('../../components/Quiz.jsx');

var LessonQuiz = React.createClass({

  statics: {
    willTransitionFrom: function(transition, component) {
      if ( !component.state.quizComplete && component.state.quizStarted ) {
        if( !window.confirm('You haven\'t finished this quiz! Are you sure you want to leave and lose all progress?') ) {
          transition.abort();
        }
      }
    }
  },

  mixins: [ReactAsync.Mixin, Reflux.ListenerMixin],

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

  getInitialStateAsync: function(cb) {
    LessonActions.openQuiz(this.props.params.lessonId.toString(), function(err, quiz) {
      cb(null, {
        quiz: quiz,
        quizComplete: false,
        quizStarted: false,
        error: null
      });
    });
  },

  _onQuizChange: function(err, quiz) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ quiz: quiz, error: null });
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentQuizStore, this._onQuizChange);
  },

  beginQuiz: function() {
    this.setState({ quizStarted: true });
  },

  flagQuizComplete: function() {
    this.setState({ quizComplete: true }, function() {
      QuizActions.markComplete(this.props.params.lessonId, this.state.quiz.id);
    }.bind(this));
  },

  render: function() {
    return (
      <Quiz currentUser={this.props.currentUser}
            lessonId={parseInt(this.props.params.lessonId)}
            quiz={this.state.quiz}
            beginQuiz={this.beginQuiz}
            flagQuizComplete={this.flagQuizComplete} />
    );
  }

});

module.exports = LessonQuiz;