/**
 * @jsx React.DOM
 */
'use strict';

var React                    = require('react/addons');
var Reflux                   = require('reflux');
var _                        = require('lodash');

var ChatSocketMixin          = require('../mixins/ChatSocketMixin');
var CurrentConversationStore = require('../stores/CurrentConversationStore'); // Required since not loaded anywhere else
var CourseRecipientsStore    = require('../stores/CourseRecipientsStore');
var CourseActions            = require('../actions/CourseActions');
var ChatActions              = require('../actions/ChatActions');
var RecipientList            = require('./RecipientList');
var Conversation             = require('./Conversation');

var Chat = React.createClass({

  mixins: [Reflux.ListenerMixin, ChatSocketMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  getInitialState: function() {
    return {
      error: null,
      recipients: [],
      currentRecipient: {},
      conversation: {}
    };
  },

  _onRecipientsChange: function(err, recipients) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ error: null, recipients: recipients });
    }
  },

  _onConversationChange: function(err, conversation) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      console.log('new conversation:', conversation);
      this.setState({ error: null, conversation: conversation || {} });
    }
  },

  componentWillMount: function() {
    this.listenTo(CourseRecipientsStore, this._onRecipientsChange);
    //this.listenTo(CurrentConversationStore, this._onConversationChange);

    if ( !_.isEmpty(this.props.course) && !_.isEmpty(this.props.currentUser) ) {
      CourseActions.openChat(this.props.course.id, this._onRecipientsChange);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if( !_.isEqual(this.props.course, nextProps.course) || !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      CourseActions.openChat(nextProps.course.id, this._onRecipientsChange);
    }
  },

  openConversation: function(recipient) {
    if ( _.isEmpty(this.state.conversation.recipient) || recipient.id !== this.state.conversation.recipient.id ) {
      this.joinChat(this.props.course.id, this.props.currentUser.id, recipient.id).then(function() {
        ChatActions.openConversation(this.props.course.id, recipient.id, this._onConversationChange);
        this.setState({ currentRecipient: recipient });
      }.bind(this));
    }
  },

  render: function() {
    return (
      <section className="chat">

        <RecipientList currentUser={this.props.currentUser}
                       course={this.props.course}
                       recipients={this.state.recipients}
                       conversation={this.state.conversation}
                       openConversation={this.openConversation} />

        <Conversation currentUser={this.props.currentUser}
                      currentRecipient={this.state.currentRecipient}
                      course={this.props.course}
                      conversation={this.state.conversation}
                      newMessages={this.state.newMessages}
                      sendMessage={this.sendMessage} />

      </section>
    );
  }

});

module.exports = React.createFactory(Chat);