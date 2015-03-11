'use strict';

var React                   = require('react/addons');
var ReactCSSTransitionGroup = React.createFactory(React.addons.CSSTransitionGroup);

var Tooltip                 = require('./Tooltip.jsx');

var ProgressBar = React.createClass({

  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      displayTooltip: false
    };
  },

  showProgressTooltip: function() {
    this.setState({ displayTooltip: true });
  },

  hideProgressTooltip: function() {
    this.setState({ displayTooltip: false });
  },

  renderTooltip: function() {
    var element = null;
    var percentage = isNaN(this.props.percentage) ? 0 : this.props.percentage;

    if ( this.state.displayTooltip ) {
      element = (
        <Tooltip left={percentage + '%'}
                 content={percentage + '%'} />
      );
    }

    return element;
  },

  render: function() {
    var fillWidth = this.props.percentage + '%';

    return (
      <div className="progress-bar" onMouseOver={this.showProgressTooltip} onMouseLeave={this.hideProgressTooltip}>

        <div className="fill" style={{width: fillWidth}} />

        <ReactCSSTransitionGroup transitionName="tooltip">
          {this.renderTooltip()}
        </ReactCSSTransitionGroup>

      </div>
    );
  }

});

module.exports = React.createFactory(ProgressBar);