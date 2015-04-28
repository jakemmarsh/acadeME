'use strict';

var React         = require('react/addons');
var ReactAsync    = require('react-async');
var when          = require('when');
var Navigation    = require('react-router').Navigation;

var awsAPI        = require('../../utils/awsAPI');
var CourseActions = require('../../actions/CourseActions');
var FileInput     = require('../../components/FileInput.jsx');
var Editor        = require('../../components/Editor.jsx');

var CreateLesson = React.createClass({

  mixins: [ReactAsync.Mixin, React.addons.LinkedStateMixin, Navigation],

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

  getInitialStateAsync: function(cb) {
    cb(null, {
      title: '',
      description: '',
      image: null
    });
  },

  updateImage: function(file) {
    this.setState({ image: file });
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
        deferred.resolve(lesson);
      }).catch(function(err) {
        console.log('error uploading lesson image:', err);
      });
    } else {
      deferred.resolve(lesson);
    }

    return deferred.promise;
  },

  handleSubmit: function(data) {
    var lesson = {
      title: this.state.title,
      description: this.state.description,
      bodyElements: data || []
    };

    this.createLesson(lesson).then(this.uploadImage).then(function(createdLesson) {
      this.transitionTo('CourseLesson', { courseId: this.props.course.id, lessonId: createdLesson.id });
    }.bind(this));
  },

  render: function() {
    return (
      <section className="create-lesson nudge">

        <h2 className="page-title">Create a Lesson</h2>

        <input type="text" valueLink={this.linkState('title')} placeholder="Lesson title" className="title-input nudge-half--bottom" />

        <textarea valueLink={this.linkState('description')}
                  className="description-input nudge-half--bottom"
                  placeholder="Brief description of the lesson" />

        <h4 className="flush--bottom">Cover Image</h4>

        <FileInput id="imageUrl" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} className="image-input nudge-half--bottom" />

        <Editor save={this.handleSubmit} />

      </section>
    );
  }

});

module.exports = CreateLesson;