/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var $     = require('jquery');

var Tooltip = React.createClass({

  propTypes: {
    content: React.PropTypes.string.isRequired,
    position: React.PropTypes.string.isRequired,
    left: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getDefaultProps: function() {
    return {
      position: 'top',
      left: 0
    };
  },

  getInitialState: function() {
    return {
      width: 0,
      height: 0
    };
  },

  componentDidMount: function() {
    this.setState({
      width: $(this.getDOMNode()).outerWidth(),
      height: $(this.getDOMNode()).outerHeight() + 10
    });
  },

  getLeftValue: function() {
    var percentRegex = new RegExp('%', 'gi');
    var pixelRegex = new RegExp('px', 'gi');
    var returnVal;

    if ( percentRegex.test(this.props.left) ) {
      returnVal = 'calc(' + this.props.left + ' - ' + this.state.width/2 + 'px)';
    } else if ( pixelRegex.test(this.props.left) ) {
      returnVal = this.props.left;
    } else {
      returnVal = this.props.left + 'px';
    }

    return returnVal;
  },

  getTopValue: function() {
    var returnVal;

    // TODO: finish this logic
    switch ( this.props.position ) {
      case 'top':
        returnVal = '-' + (this.state.height + 5);
        break;
      case 'right':
        break;
      case 'bottom':
        break;
      case 'left':
        break;
    }

    return returnVal;
  },

  render: function() {
    var classes = 'tooltip ' + this.props.position;
    var styles = {
      'left': this.getLeftValue(),
      'top': this.getTopValue(),
      'bottom': this.props.bottom,
    };

    return (
      <div className={classes} style={styles} key={'tooltip'}>
        {this.props.content}
      </div>
    );
  }

});

module.exports = React.createFactory(Tooltip);