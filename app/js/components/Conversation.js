/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var _          = require('lodash');
var $          = require('jquery');

var UserAvatar = require('./UserAvatar');

var Conversation = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentRecipient: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired,
    conversation: React.PropTypes.object.isRequired,
    newMessages: React.PropTypes.array,
    sendMessage: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      currentRecipient: {},
      course: {},
      conversation: {},
      newMessages: []
    };
  },

  getInitialState: function() {
    return {
      newMessage: ''
    };
  },

  componentDidUpdate: function() {
    var $messagesContainer;
    var $lastChild;
    var lastChildBottom;
    if ( this.props.conversation.messages || this.props.newMessages.length ) {
      $messagesContainer = $(this.refs.messages.getDOMNode());
      $lastChild = $messagesContainer.children('li').last();
      lastChildBottom = ($lastChild && $lastChild.position()) ? $lastChild.position().top + $lastChild.outerHeight(true) : 0;

      // Keep messages container scrolled to bottom of newest message as new messages are sent
      $messagesContainer.scrollTop(lastChildBottom);
    }
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.props.sendMessage(this.state.newMessage, this.props.conversation, this.props.currentUser, function() {
        this.setState({ newMessage: '' });
      }.bind(this));
    }
  },

  getMessageUser: function(message) {
    if ( message.userId === this.props.currentUser.id ) {
      return this.props.currentUser;
    } else if ( message.userId === this.props.currentRecipient.id ) {
      return this.props.currentRecipient;
    }
  },

  userDidSend: function(message) {
    return message.userId === this.props.currentUser.id;
  },

  renderMessages: function(messages) {
    var elements = null;
    var classes;
    var messageUser;

    if ( !_.isEmpty(messages) ) {
      elements = _.chain(messages)
      .sortBy(function(message) { return message.createdAt; })
      .map(function(message, index) {
        classes = 'message' + (this.userDidSend(message) ? ' user-sent' : '');
        messageUser = this.userDidSend(message) ? this.props.currentUser : message.user;

        return (
          <li key={index} className={classes}>
            <div className="user-container">
              <UserAvatar user={this.getMessageUser(message)} />
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

  renderMessagesSeperator: function() {
    var element = null;

    if ( !_.isEmpty(this.props.conversation.messages) ) {
      element = (
        <hr />
      );
    }

    return element;
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

        <ul ref="messages" className="messages-container">
          {this.renderMessages(this.props.conversation.messages)}
          {this.renderMessagesSeperator()}
          {this.renderMessages(this.props.newMessages)}
        </ul>

        {this.renderInput()}

      </div>
    );
  }

});

module.exports = React.createFactory(Conversation);