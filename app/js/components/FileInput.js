/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var FileInput = React.createClass({

  propTypes: {
    processFile: React.PropTypes.func.isRequired,
    id: React.PropTypes.string,
    accept: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      accept: '*',
      id: ''
    };
  },

  getInitialState: function() {
    return {
      dataUri: null,
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  onFileSelect: function(e) {
    this.props.processFile(e.target.files[0]);
  },

  render: function() {
    return (
      <input type="file" id={this.props.id} accept={this.props.accept} onChange={this.onFileSelect} />
    );
  }

});

module.exports = React.createFactory(FileInput);