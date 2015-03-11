'use strict';

var React = require('react/addons');

var TopMenu = React.createClass({

  render: function() {
    return (
      <ul className="top-menu">

        {this.props.children}

      </ul>
    );
  }

});

module.exports = React.createFactory(TopMenu);