/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var Navigation    = require('react-router').Navigation;
var Reflux        = require('reflux');

var CourseActions = require('../../actions/CourseActions');

var CreateLesson = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  _onLessonChange: function(lesson) {
    this.setState({
      lesson: lesson
    });
  },

  handleSubmit: function() {
    var lesson = {};

    CourseActions.createLesson(lesson, function() {
      console.log('lesson created');
      this.transitionTo('Course', { courseId: this.props.course.id });
    });
  },

  render: function() {
    return (
      <div>
        Create lesson for course: {this.props.course.id}
      </div>
    );
  }

});

module.exports = React.createFactory(CreateLesson);