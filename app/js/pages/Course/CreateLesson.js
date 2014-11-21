/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var Navigation      = require('react-router').Navigation;

var CourseActions   = require('../../actions/CourseActions');
var SirTrevorEditor = require('../../components/SirTrevorEditor');

var CreateLesson = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin],

  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  getInitialState: function() {
    return {
      title: ''
    };
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
      <section className="create-lesson nudge">

        <input type="text" valueLink={this.linkState('title')} placeholder="Lesson title" className="lesson-title-input nudge-half--bottom" />

        <SirTrevorEditor save={this.handleSubmit} />

      </section>
    );
  }

});

module.exports = React.createFactory(CreateLesson);