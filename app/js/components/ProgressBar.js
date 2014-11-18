/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var ProgressBar = React.createClass({

  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  showTooltip: function() {
    console.log('hover over progress bar');
  },

  render: function() {
    var fillWidth = this.props.percentage + '%';

    return (
      <div className="progress-bar" onMouseOver={this.showTooltip}>
        <div className="fill" style={{width: fillWidth}} />
      </div>
    );
  }

});

module.exports = React.createFactory(ProgressBar);