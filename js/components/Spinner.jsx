'use strict';

var React = require('react/addons');

var Spinner = React.createClass({

  render: function() {
    return (
      <i className="fa fa-spinner fa-spin" />
    );
  }

});

module.exports = Spinner;