/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');

var CurrentQuizStore = require('../../stores/CurrentQuizStore');
var LessonActions    = require('../../actions/LessonActions');
var Quiz             = require('../../components/Quiz');

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

  mixins: [Reflux.ListenerMixin],

  getDefaultProps: function() {
    return {
      course: {}
    };
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

  componentWillMount: function() {
    LessonActions.openQuiz(this.props.params.lessonId.toString());
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
      <div>
        <Quiz quiz={this.state.quiz} flagQuizComplete={this.flagQuizComplete} />
      </div>
    );
  }

});

module.exports = React.createFactory(LessonQuiz);