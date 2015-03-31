'use strict';

var React              = require('react/addons');
var ReactAsync         = require('react-async');
var Reflux             = require('reflux');
var _                  = require('lodash');
var marked             = require('react-marked');
var Link               = require('react-router').Link;

var CurrentLessonStore = require('../../stores/CurrentLessonStore');
var LessonActions      = require('../../actions/LessonActions');

var CourseLesson = React.createClass({

  mixins: [ReactAsync.Mixin, Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialStateAsync: function(cb) {
    LessonActions.openLesson(this.props.params.lessonId.toString(), function(err, lesson) {
      cb(null, {
        lesson: lesson || {}
      });
    });
  },

  getInitialState: function() {
    return {
      lesson: {}
    };
  },

  _onLessonChange: function(err, lesson) {
    if ( err ) {
      this.setState({ erorr: err.message });
    } else {
      this.setState({ lesson: lesson || {}, error: null });
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentLessonStore, this._onLessonChange);
  },

  renderTextElement: function(element, index) {
    return (
      <div className="element text" key={index}>
        <p>{marked(element.data.text)}</p>
      </div>
    );
  },

  renderImageElement: function(element, index) {
    return (
      <div className="element image" key={index}>
      </div>
    );
  },

  renderVideoElement: function(element, index) {
    return (
      <div className="element video" key={index}>
      </div>
    );
  },

  renderHeadingElement: function(element, index) {
    return (
      <div className="element heading" key={index}>
        <h1>{marked(element.data.text)}</h1>
      </div>
    );
  },

  renderQuoteElement: function(element, index) {
    return (
      <div className="element quote" key={index}>
        {marked(element.data.text)}
        {marked(element.data.cite)}
      </div>
    );
  },

  renderLessonBody: function() {
    return _.map(this.state.lesson.bodyElements, function(element, index) {
      switch ( element.type ) {
        case 'text':
          return this.renderTextElement(element, index);
        case 'image':
          return this.renderImageElement(element, index);
        case 'video':
          return this.renderVideoElement(element, index);
        case 'heading':
          return this.renderHeadingElement(element, index);
        case 'quote':
          return this.renderQuoteElement(element, index);
      }
    }.bind(this));
  },

  renderQuizLink: function() {
    var element = null;

    if ( !_.isEmpty(this.state.lesson) && this.state.lesson.quiz && _.isNumber(this.state.lesson.quiz.id) ) {
      element = (
        <Link to="LessonQuiz"
              params={{ courseId: this.props.params.courseId, lessonId: this.props.params.lessonId }}
              className="button inline-block">
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

module.exports = CourseLesson;