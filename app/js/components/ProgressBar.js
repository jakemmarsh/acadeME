/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var ProgressBar = React.createClass({

  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  render: function() {
    var fillWidth = this.props.percentage + '%';

    return (
      <div className="progress-bar">
        <div className="fill" style={{width: fillWidth}} />
      </div>
    );
  }

});

module.exports = ProgressBar;