/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var _          = require('lodash');

var UserAvatar = require('./UserAvatar');

var RecipientList = React.createClass({

  propTypes: {
    course: React.PropTypes.object.isRequired,
    recipients: React.PropTypes.array.isRequired,
    conversation: React.PropTypes.object.isRequired,
    openConversation: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      course: {},
      recipients: [],
      conversation: {}
    };
  },

  isActive: function(recipientId) {
    if ( this.props.conversation ) {
      return this.props.conversation.userOneId === recipientId || this.props.conversation.userTwoId === recipientId;
    } else {
      return false;
    }
  },

  renderInstructor: function() {
    var element = null;
    var classes;

    if ( this.props.course && this.props.course.instructor ) {
      classes = this.isActive(this.props.course.instructor.id) ? 'active' : '';

      element = (
        <li onClick={this.props.openConversation.bind(null, this.props.course.instructor)} className={classes}>
          <div className="avatar-container">
            <UserAvatar user={this.props.course.instructor} />
          </div>
          <div className="name-container">
            {this.props.course.instructor.name}
          </div>
        </li>
      );
    }

    return element;
  },

  renderRecipients: function() {
    var classes;

    return _.map(this.props.recipients, function(recipient, index) {
      classes = this.isActive(recipient.id) ? 'active' : '';

      return (
        <li key={index} onClick={this.props.openConversation.bind(null, recipient)} className={classes}>
          <div className="avatar-container">
            <UserAvatar user={recipient} />
          </div>
          <div className="name-container">
            {recipient.name}
          </div>
        </li>
      );
    }.bind(this));
  },

  render: function() {
    return (
      <ul className="recipient-list">

        <li className="title"><h5 className="flush">Instructor</h5></li>

        {this.renderInstructor()}

        <li className="title"><h5 className="flush">Classmates</h5></li>

        {this.renderRecipients()}

        <div className="shadow" />

      </ul>
    );
  }

});

module.exports = React.createFactory(RecipientList);