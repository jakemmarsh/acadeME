'use strict';

var React = require('react/addons');

var CourseImage = React.createClass({

  propTypes: {
    course: React.PropTypes.object.isRequired,
    size: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  render: function() {
    var imageStyles = {
      'backgroundImage': this.props.course.imageUrl ? 'url(' + this.props.course.imageUrl + ')' : null,
      'width': this.props.size,
      'height': this.props.size
    };

    return (
      <div className="course-image" style={imageStyles} />
    );
  }

});

module.exports = CourseImage;