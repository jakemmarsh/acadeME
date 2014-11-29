/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var Reflux        = require('reflux');

var CourseActions         = require('../../actions/CourseActions');
var ConversationListStore = require('../../stores/ConversationListStore');

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
      elements = _.map(this.state.conversations, function(conversation, index) {
        return (
          <li key={index}>{conversation.recipient}</li>
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