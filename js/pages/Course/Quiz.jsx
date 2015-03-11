'use strict';

var React            = require('react/addons');
var ReactAsync       = require('react-async');
var Reflux           = require('reflux');

var CurrentQuizStore = require('../../stores/CurrentQuizStore');
var LessonActions    = require('../../actions/LessonActions');
var Quiz             = require('../../components/Quiz.jsx');

var LessonQuiz = React.createClass({

  statics: {
    willTransitionFrom: function(transition, component) {
      if ( !component.state.quizComplete ) {
        if( !window.confirm('You haven\'t yet finished this quiz! Are you sure you want to leave and lose all progress?') ) {
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
        quizComplete: false
      });
    });
  },

  getInitialState: function() {
    return {
      quiz: {},
      quizComplete: false
    };
  },

  _onQuizChange: function(quiz) {
    this.setState({
      quiz: quiz
    });
  },

  componentDidMount: function() {
    this.listenTo(CurrentQuizStore, this._onQuizChange);
  },

  flagQuizComplete: function() {
    this.setState({
      quizComplete: true
    });
  },

  render: function() {
    return (
      <Quiz currentUser={this.props.currentUser}
            lessonId={parseInt(this.props.params.lessonId)}
            quiz={this.state.quiz}
            flagQuizComplete={this.flagQuizComplete} />
    );
  }

});

module.exports = LessonQuiz;