/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('underscore');

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
    }
  },

  userDidSend: function(message) {
    return message.userId === this.props.currentUser.id;
  },

  renderMessages: function() {
    var elements = null;
    var classes;

    if ( !_.isEmpty(this.props.conversation) ) {
      elements = _.map(this.props.conversation.messages, function(message, index) {
        classes = 'message' + (this.userDidSend(message) ? ' user-sent' : '');

        return (
          <li key={index} className={classes}>
            <div className="user-container" />
            <div className="body-container">
              {message.body}
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
               valueLink={this.linkState('query')}
               onKeyPress={this.submitOnEnter}  />
      );
    }

    return element;
  },

  render: function() {
    return (
      <div className="conversation">

        <div className="messages-container">
          {this.renderMessages()}
        </div>

        {this.renderInput()}

      </div>
    );
  }

});

module.exports = React.createFactory(Conversation);