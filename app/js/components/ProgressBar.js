/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var ReactCSSTransitionGroup = React.createFactory(React.addons.CSSTransitionGroup);

var Tooltip                 = require('./Tooltip');

var ProgressBar = React.createClass({

  propTypes: {
    percentage: React.PropTypes.number.isRequired,
    showTooltip: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function() {
    return {
      showTooltip: false
    };
  },

  renderTooltip: function() {
    var element = null;

    if ( this.props.showTooltip ) {
      element = (
        <Tooltip left={this.props.percentage + '%'}
                 content={this.props.percentage + '%'} />
      );
    }

    return element;
  },

  render: function() {
    var fillWidth = this.props.percentage + '%';

    return (
      <div className="progress-bar">

        <div className="fill" style={{width: fillWidth}} />

        <ReactCSSTransitionGroup transitionName="tooltip">
          {this.renderTooltip()}
        </ReactCSSTransitionGroup>

      </div>
    );
  }

});

module.exports = React.createFactory(ProgressBar);