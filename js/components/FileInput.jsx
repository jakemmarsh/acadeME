'use strict';

var React = require('react/addons');

var FileInput = React.createClass({

  propTypes: {
    processFile: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    accept: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      className: '',
      accept: '*',
      id: ''
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
      <input type="file" id={this.props.id} className={this.props.className} accept={this.props.accept} onChange={this.onFileSelect} />
    );
  }

});

module.exports = FileInput;