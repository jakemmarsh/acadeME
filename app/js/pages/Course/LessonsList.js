/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var Reflux          = require('reflux');
var _               = require('underscore');

var LessonListStore = require('../../stores/LessonListStore');
var LessonSnippet   = require('../../components/LessonSnippet');

var CourseLessonsList = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  getInitialState: function() {
    return {
      lessons: LessonListStore.currentList || []
    };
  },

  _onLessonListChange: function(lessonList) {
    this.setState({
      lessons: lessonList
    });
  },

  componentDidMount: function() {
    this.listenTo(LessonListStore, this._onLessonListChange);
  },

  renderLessons: function() {
    var elements = null;

    if ( !_.isEmpty(this.props.course) && this.state.lessons ) {
      elements =  this.state.lessons.map(function(lesson, index) {
        return (
          <LessonSnippet course={this.props.course} lesson={lesson} key={index} />
        );
      }.bind(this));
    }

    return elements;
  },

  render: function() {
    return (
      <div>
        {this.renderLessons()}
      </div>
    );
  }

});

module.exports = CourseLessonsList;