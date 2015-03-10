/**
 * @jsx React.DOM
 */
'use strict';

var React  = require('react/addons');
var Reflux = require('reflux');

var Chat   = require('../../components/Chat.jsx');

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

  render: function() {
    return (
      <Chat currentUser={this.props.currentUser} course={this.props.course} />
    );
  }

});

module.exports = React.createFactory(CourseChat);