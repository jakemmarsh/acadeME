/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var UserAvatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  render: function() {
    var avatarStyles = {
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null
    };

    return (
      <div className="user-avatar" style={avatarStyles} />
    );
  }

});

module.exports = React.createFactory(UserAvatar);