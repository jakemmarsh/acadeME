/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var _          = require('underscore');

var UserAvatar = require('./UserAvatar');

var Conversation = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired,
    conversation: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      course: {},
      conversation: {}
    };
  },

  getInitialState: function() {
    return {
      newMessage: ''
    };
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      console.log('new message:', this.state.newMessage);
      this.setState({ newMessage: '' });
    }
  },

  userDidSend: function(message) {
    return message.user.id === this.props.currentUser.id;
  },

  renderMessages: function() {
    var elements = null;
    var classes;
    var messageUser;

    if ( !_.isEmpty(this.props.conversation) ) {
      elements = _.map(this.props.conversation.messages, function(message, index) {
        classes = 'message' + (this.userDidSend(message) ? ' user-sent' : '');
        messageUser = this.userDidSend(message) ? this.props.currentUser : message.user;

        return (
          <li key={index} className={classes}>
            <div className="user-container">
              <UserAvatar user={messageUser} />
            </div>
            <div className="body-container">
              <div className="body">{message.body}</div>
            </div>
          </li>
        );
      }.bind(this));
    }

    return elements;
  },

  renderInput: function() {
    var element = null;

    if ( !_.isEmpty(this.props.conversation) ) {
      element = (
        <input type="text"
               id="new-message"
               className="message-input"
               placeholder="Send a message..."
               valueLink={this.linkState('newMessage')}
               onKeyPress={this.submitOnEnter}  />
      );
    }

    return element;
  },

  render: function() {
    return (
      <div className="conversation">

        <ul className="messages-container">
          {this.renderMessages()}
        </ul>

        {this.renderInput()}

      </div>
    );
  }

});

module.exports = React.createFactory(Conversation);