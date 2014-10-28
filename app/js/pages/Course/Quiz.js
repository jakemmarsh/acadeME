/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');

var CurrentQuizStore = require('../../stores/CurrentQuizStore');
var LessonActions    = require('../../actions/LessonActions');

var LessonQuiz = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  getInitialState: function() {
    return {
      quiz: {}
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

  render: function() {
    return (
      <div>
        Quiz for specific course lesson
      </div>
    );
  }

});

module.exports = LessonQuiz;