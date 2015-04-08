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
    course: React.PropTypes.object.isRequired,
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
        <img src={element.data.path} />
      </div>
    );
  },

  renderVideoElement: function(element, index) {
    // TODO: this setup will currently only work for YouTube videos
    var srcUrl = '//www.' + element.data.source + '.com/embed/' + element.data.remoteId;

    return (
      <iframe width="600" height="375" src={srcUrl} frameborder="0" key={index} allowfullscreen />
    );
  },

  renderHeadingElement: function(element, index) {
    return (
      <div className="element heading" key={index}>
        <h2>{marked(element.data.text)}</h2>
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
    if ( !_.isEmpty(this.state.lesson) ) {
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
    }
  },

  renderQuizLink: function() {
    var element = null;
    var haveLesson = !_.isEmpty(this.state.lesson);
    var userIsInstructor = !_.isEmpty(this.props.currentUser) && this.props.course.instructorId === this.props.currentUser.id;
    var quizExists = haveLesson && !_.isEmpty(this.state.lesson.quiz);

    if ( haveLesson && userIsInstructor && !quizExists ) {
      element = (
        <Link to="CreateQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.state.lesson.id }}
              className="button highlight block full-width text-center">
          Create Quiz
        </Link>
      );
    } else if ( haveLesson && quizExists && !userIsInstructor ) {
      element = (
        <Link to="LessonQuiz"
              params={{ courseId: this.props.course.id, lessonId: this.state.lesson.id }}
              className="button block full-width text-center">
          Take Quiz
        </Link>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>
        <h1 className="nudge--sides nudge-half--ends">{!_.isEmpty(this.state.lesson) ? this.state.lesson.title : ''}</h1>
        <div className="lesson islet nudge flush--top">
          {this.renderLessonBody()}
          {this.renderQuizLink()}
        </div>
      </div>
    );
  }

});

module.exports = CourseLesson;