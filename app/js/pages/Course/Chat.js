/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var Reflux        = require('reflux');

var CourseActions = require('../../actions/CourseActions');
var Chat          = require('../../components/Chat');

var CourseChat = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propType: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  componentWillMount: function() {
    CourseActions.openChat(this.props.params.courseId);
  },

  render: function() {
    return (
      <Chat currentUser={this.props.currentUser} course={this.props.course} />
    );
  }

});

module.exports = React.createFactory(CourseChat);