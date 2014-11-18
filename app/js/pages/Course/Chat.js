/**
 * @jsx React.DOM
 */
'use strict';

var React                 = require('react/addons');
var Reflux                = require('reflux');
var _                     = require('underscore');

var CourseActions         = require('../../actions/CourseActions');
var ConversationListStore = require('../../stores/ConversationListStore');

var CourseChat = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getDefaultProps: function() {
    return {
      course: {}
    };
  },

  getInitialState: function() {
    return {
      conversations: []
    };
  },

  _onConversationListChange: function(conversationList) {
    this.setState({
      conversations: conversationList
    }, function() {
    });
  },

  componentWillMount: function() {
    CourseActions.openConversations(this.props.params.courseId);
  },

  componentDidMount: function() {
    this.listenTo(ConversationListStore, this._onConversationListChange);
  },

  renderConversations: function() {
    var elements = null;

    if ( this.state.conversations ) {
      elements = _.map(this.state.conversations, function(conversation) {
        return (
          <li>{conversation.recipient}</li>
        );
      });
    }

    return elements;
  },

  render: function() {
    return (
      <div>
        {this.renderConversations()}
      </div>
    );
  }

});

module.exports = React.createFactory(CourseChat);