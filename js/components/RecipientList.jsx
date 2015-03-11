'use strict';

var React      = require('react/addons');
var _          = require('lodash');

var UserAvatar = require('./UserAvatar.jsx');

var RecipientList = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired,
    recipients: React.PropTypes.array.isRequired,
    conversation: React.PropTypes.object.isRequired,
    openConversation: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
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

  renderInstructorTitle: function() {
    var element = null;

    if ( this.props.course && this.props.course.instructor && this.props.currentUser.id !== this.props.course.instructor.id ) {
      element = (
        <li className="title"><h5 className="flush">Instructor</h5></li>
      );
    }

    return element;
  },

  renderInstructor: function() {
    var element = null;
    var classes;

    if ( this.props.course && this.props.course.instructor && this.props.currentUser.id !== this.props.course.instructor.id ) {
      classes = this.isActive(this.props.course.instructor.id) ? 'active' : '';

      element = (
        <li onClick={this.props.openConversation.bind(null, this.props.course.instructor)} className={classes}>
          <div className="avatar-container">
            <UserAvatar user={this.props.course.instructor} />
          </div>
          <div className="name-container">
            {this.props.course.instructor.fullName}
          </div>
        </li>
      );
    }

    return element;
  },

  renderRecipientsTitle: function() {
    var element = null;
    var titleString = (this.props.course.instructor && this.props.course.instructor.id === this.props.currentUser.id ) ? 'Students' : 'Classmates';

    if ( this.props.course && this.props.recipients ) {
      element = (
        <li className="title"><h5 className="flush">{titleString}</h5></li>
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
            {recipient.fullName}
          </div>
        </li>
      );
    }.bind(this));
  },

  render: function() {
    return (
      <ul className="recipient-list">

        {this.renderInstructorTitle()}

        {this.renderInstructor()}

        {this.renderRecipientsTitle()}

        {this.renderRecipients()}

        <div className="shadow" />

      </ul>
    );
  }

});

module.exports = React.createFactory(RecipientList);