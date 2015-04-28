'use strict';

var React         = require('react/addons');
var ReactAsync    = require('react-async');
var when          = require('when');
var Navigation    = require('react-router').Navigation;
var DocumentTitle = require('react-document-title');

var awsAPI        = require('../utils/awsAPI');
var CourseAPI     = require('../utils/CourseAPI');
var FileInput     = require('../components/FileInput.jsx');

var CreateCoursePage = React.createClass({

  mixins: [ReactAsync.Mixin, Navigation, React.addons.LinkedStateMixin],

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

  createCourse: function(course) {
    var deferred = when.defer();

    CourseAPI.create(course).then(function(createdCourse) {
      console.log('course created:', createdCourse);
      deferred.resolve(createdCourse);
    }).catch(function(err) {
      console.log('error creating course:', err);
    });

    return deferred.promise;
  },

  uploadImage: function(course) {
    var deferred = when.defer();

    if ( this.state.image ) {
      awsAPI.uploadCourseImage(this.state.image, course.id).then(function() {
        deferred.resolve(course);
      }).catch(function(err) {
        console.log('error uploading course image:', err);
      });
    } else {
      deferred.resolve(course);
    }

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    var course = {
      title: this.state.title,
      description: this.state.description
    };

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    this.createCourse(course).then(this.uploadImage).then(function(createdCourse) {
      this.transitionTo('Course', { courseId: createdCourse.id });
    }.bind(this));
  },

  render: function() {
    return (
      <DocumentTitle title="Create a Course">
        <section className="create-course nudge">

          <h2 className="page-title">Create a Course</h2>

          <form className="create-course-form" id="create-course-form" onSubmit={this.handleSubmit}>

            <input type="text" valueLink={this.linkState('title')} placeholder="Course title" className="title-input nudge-half--bottom" />

            <textarea valueLink={this.linkState('description')}
                    className="description-input nudge-half--bottom"
                    placeholder="Brief description of the course" />

            <FileInput id="imageUrl" className="image-input nudge-half--bottom" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />

            <input type="submit" className="submit button float-right nudge--bottom" value="Create Course" />

          </form>

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = CreateCoursePage;