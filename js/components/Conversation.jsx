'use strict';

var React     = require('react/addons');
var _         = require('lodash');
var $         = require('jquery');
var when      = require('when');

var ChatAPI   = require('../utils/ChatAPI');
var Message   = require('./Message.jsx');
var FileInput = require('./FileInput.jsx');
var Spinner   = require('./Spinner.jsx');

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
      newMessage: '',
      attachment: null,
      loading: false
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

  updateAttachment: function(file) {
    this.setState({ attachment: file });
  },

  uploadAttachment: function() {
    var deferred = when.defer();

    this.setState({ loading: true });

    if ( this.state.attachment ) {
      ChatAPI.uploadAttachment(
        this.props.conversation.id,
        this.props.currentUser.id,
        this.state.attachment
      ).then(function(resp) {
        deferred.resolve(resp);
      }).catch(function(err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve(null);
    }

    return deferred.promise;
  },

  sendMessage: function(attachment) {
    var deferred = when.defer();

    attachment = attachment || null;

    this.props.sendMessage(
      this.state.newMessage || '',
      this.props.conversation.id,
      this.props.currentUser.id,
      attachment,
      deferred.resolve
    );

    return deferred.promise;
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( (keyCode === '13' || keyCode === 13) && !this.state.loading ) {
      this.uploadAttachment().then(this.sendMessage).then(function() {
        this.setState({ newMessage: '', attachment: null, loading: false });
      }.bind(this)).catch(function(err) {
        this.setState({ error: err.message });
      }.bind(this));
    }
  },

  renderMessageAttachment: function(message) {
    var element = null;

    if ( message.attachment ) {
      return (
        <div><a href={message.attachment.url}>{message.attachment.name}</a></div>
      );
    }

    return element;
  },

  renderMessages: function(messages) {
    var elements = null;

    if ( !_.isEmpty(messages) ) {
      elements = _.chain(messages)
      .sortBy(function(message) { return message.createdAt; })
      .map(function(message, index) {
        return (
          <Message currentUser={this.props.currentUser}
                   currentRecipient={this.props.currentRecipient}
                   message={message}
                   key={index} />
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
    var attachmentElement = this.state.loading ? <Spinner /> : <i className="fa fa-paperclip" />;

    console.log('is loading:', this.state.loading);
    console.log('attachment element:', attachmentElement);

    if ( !_.isEmpty(this.props.conversation) ) {
      element = (
        <div className="input-container">
          <input type="text"
                 id="new-message"
                 className="message-input"
                 placeholder="Send a message..."
                 valueLink={this.linkState('newMessage')}
                 onKeyPress={this.submitOnEnter}  />
          <span className="file-name">{this.state.attachment ? this.state.attachment.name : ''}</span>
          <label className="file-button">
            {attachmentElement}
            <span>
              <FileInput id="message-attachment"
                         accept="image/x-png, image/gif, image/jpeg, application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                         processFile={this.updateAttachment} />
            </span>
          </label>
        </div>
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

module.exports = Conversation;