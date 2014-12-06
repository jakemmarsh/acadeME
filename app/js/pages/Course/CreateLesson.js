/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var when          = require('when');
var Navigation    = require('react-router').Navigation;

var awsAPI        = require('../../utils/awsAPI');
var CourseActions = require('../../actions/CourseActions');
var FileInput     = require('../../components/FileInput');
var Editor        = require('../../components/Editor');

var CreateLesson = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  getInitialState: function() {
    return {
      title: '',
      description: '',
      image: null
    };
  },

  updateImage: function(file) {
    this.setState({
      image: file
    });
  },

  createLesson: function(lesson) {
    var deferred = when.defer();

    CourseActions.createLesson(lesson, function(err, createdLesson) {
      if ( err ) {
        console.log('error creating lesson:', err);
      } else {
        console.log('lesson created:', createdLesson);
        deferred.resolve(createdLesson);
      }
    });

    return deferred.promise;
  },

  uploadImage: function(lesson) {
    var deferred = when.defer();

    if ( this.state.image ) {
      awsAPI.uploadLessonImage(this.state.image, lesson.id).then(function() {
        deferred.resolve();
      }).catch(function(err) {
        console.log('error uploading lesson image:', err);
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  handleSubmit: function(data) {
    var lesson = {
      title: this.state.title,
      description: this.state.description,
      bodyElements: data || []
    };

    this.createLesson(lesson).then(this.uploadImage).then(function() {
      this.transitionTo('Course', { courseId: this.props.course.id });
    }.bind(this));
  },

  render: function() {
    return (
      <section className="create-lesson nudge">

        <input type="text" valueLink={this.linkState('title')} placeholder="Lesson title" className="lesson-title-input nudge-half--bottom" />

        <input type="text" valueLink={this.linkState('description')} placeholder="Brief description of the lesson" className="lesson-description-input nudge-half--bottom" />

        <FileInput id="imageUrl" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />

        <Editor save={this.handleSubmit} />

      </section>
    );
  }

});

module.exports = React.createFactory(CreateLesson);