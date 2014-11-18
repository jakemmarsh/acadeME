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
        Specific course lesson
      </div>
    );
  }

});

module.exports = React.createFactory(CourseLesson);