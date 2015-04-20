'use strict';

var React      = require('react/addons');
var _          = require('lodash');
var $          = require('jquery');

var TagInput = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    limit: React.PropTypes.number,
    addTag: React.PropTypes.func,
    removeTag: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      placeholder: '',
      className: '',
      limit: 5,
      addTag: function() {},
      removeTag: function() {}
    };
  },

  componentDidMount: function() {
    var $input = $(this.getDOMNode());
    var isDuplicate = false;

    require('bootstrap-tokenfield')($);

    $input.tokenfield({
      limit: this.props.limit
    });

    // Prevent duplicate tags
    $input.on('tokenfield:createtoken', function (evt) {
      _.each(this.getTokens(), function(token) {
        if ( token === evt.attrs.value ) {
          evt.preventDefault();
          isDuplicate = true;
        }
      });
      if ( !isDuplicate ) { this.props.addTag(evt.attrs.value); }
    }.bind(this));

    // Update parent state accordingly when a token is removed
    $input.on('tokenfield:removetoken', function(evt) {
      this.props.removeTag(evt.attrs.value);
    }.bind(this));
  },

  getTokens: function() {
    return _.map($(this.getDOMNode()).tokenfield('getTokens'), function(token) {
      return token.value;
    });
  },

  render: function() {
    var className = 'tag-input ' + (this.props.className || '');

    return (
      <input type="text" className={className} placeholder={this.props.placeholder} />
    );
  }

});

module.exports = TagInput;