/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = React.createFactory(require('react-router').Link);

var CourseImage = require('./CourseImage');

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
    if ( this.props.course.imageUrl ) {
      element = (
        <div className="image-container">
          <CourseImage course={this.props.course} />
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <article className="course-snippet islet">

        {this.renderCourseImage()}

        <div className="info-container">
          <h3 className="title">{this.props.course.title}</h3>

          <p className="description flush">{this.props.course.description}</p>
        </div>

        <div className="arrow-container text-right">
          <div className="go-arrow">
            <i className="fa fa-angle-right" />
          </div>
        </div>

        <Link to="Course" params={{ courseId: this.props.course.id }} />

      </article>
    );
  }

});

module.exports = React.createFactory(CourseSnippet);