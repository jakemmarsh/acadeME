/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');

var CurrentLessonStore = require('../../stores/CurrentLessonStore');
var LessonActions      = require('../../actions/LessonActions');

var CourseLesson = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
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

  render: function() {
    return (
      <div>
        <h2 className="nudge nudge-half--bottom">{this.state.lesson.title}</h2>
        <div className="lesson islet nudge flush--top">
          Specific course lesson
        </div>
      </div>
    );
  }

});

module.exports = React.createFactory(CourseLesson);