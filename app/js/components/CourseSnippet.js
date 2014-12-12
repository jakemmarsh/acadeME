/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = React.createFactory(require('react-router').Link);

var CourseSnippet = React.createClass({

  propTypes: {
    course: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  renderCourseImage: function() {
    var element = null;
    var imageStyles;

    if ( this.props.course.imageUrl ) {
      imageStyles = {
        'backgroundImage': 'url(' + this.props.course.imageUrl + ')'
      };

      element = (
        <div className="image-container">
          <div className="course-image" style={imageStyles} />
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <article className="course-snippet">

        {this.renderCourseImage()}

        <div className="info-container">
          <h3 className="title">{this.props.course.title}</h3>

          <p className="description flush">{this.props.course.description}</p>
        </div>

        <Link to="Course" params={{ courseId: this.props.course.id }} />

      </article>
    );
  }

});

module.exports = React.createFactory(CourseSnippet);