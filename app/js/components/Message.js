/**
 * @jsx React.DOM
 */
'use strict';

var React                = require('react/addons');
var cx                   = React.addons.classSet;

var AttachmentModalMixin = require('../mixins/AttachmentModalMixin');
var UserAvatar           = require('./UserAvatar');

var Message = React.createClass({

  mixins: [AttachmentModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentRecipient: React.PropTypes.object.isRequired,
    message: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      currentRecipient: {},
      message: {}
    };
  },

  getMessageUser: function() {
    if ( this.props.message.userId === this.props.currentUser.id ) {
      return this.props.currentUser;
    } else if ( this.props.message.userId === this.props.currentRecipient.id ) {
      return this.props.currentRecipient;
    }
  },

  didUserSend: function() {
    return this.props.message.userId === this.props.currentUser.id;
  },

  openAttachmentModal: function() {
    this.showAttachmentModal(this.props.message.attachment);
  },

  renderMessageAttachment: function() {
    var element = null;
    var classes = cx({
      'text-right': true,
      'nudge-quarter--top': this.props.message.body && this.props.message.body.length
    });

    if ( this.props.message.attachment ) {
      return (
        <div className={classes}>
          <a onClick={this.openAttachmentModal}>
            {this.props.message.attachment.name}
          </a>
          <i className="fa fa-paperclip nudge-quarter--left" />
        </div>
      );
    }

    return element;
  },

  render: function() {
    var classes = 'message' + (this.didUserSend() ? ' user-sent' : '');
    return (
      <li className={classes}>
        <div className="user-container">
          <UserAvatar user={this.getMessageUser()} />
        </div>
        <div className="body-container">
          <div className="body">
            {this.props.message.body}
            {this.renderMessageAttachment()}
          </div>
        </div>
      </li>
    );
  }

});

module.exports = React.createFactory(Message);