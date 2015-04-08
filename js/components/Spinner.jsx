'use strict';

var React = require('react/addons');

var Spinner = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },

  render: function() {
    var element = null;

    if ( this.props.loading ) {
      element = (
        <i className="fa fa-spinner fa-spin" />
      );
    }

    return element;
  }

});

module.exports = Spinner;