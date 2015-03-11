'use strict';

var React = require('react/addons');

var UserAvatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  render: function() {
    var avatarStyles = {
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null,
      'width': this.props.size ? this.props.size + 'px' : null,
      'height': this.props.size ? this.props.size + 'px' : null
    };

    return (
      <div className="user-avatar" style={avatarStyles} />
    );
  }

});

module.exports = React.createFactory(UserAvatar);