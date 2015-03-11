'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var _                  = require('lodash');
var marked             = require('react-marked');
var Link               = React.createFactory(require('react-router').Link);

var CurrentLessonStore = require('../../stores/CurrentLessonStore');
var LessonActions      = require('../../actions/LessonActions');

var CourseLesson = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    lesson: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      currentUser: {},
      lesson: {}
    };
  },

  _onLessonChange: function(err, lesson) {
    if ( err ) {
      // TODO: handle error
    } else {
      this.setState({ lesson: lesson });
    }
  },

  componentWillMount: function() {
    LessonActions.openLesson(this.props.params.lessonId.toString());
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

    // TODO: check if
    if ( !_.isEmpty(this.state.lesson) ) {
      element = (
        <Link to="LessonQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.state.lesson.id }}
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

module.exports = React.createFactory(CourseLesson);