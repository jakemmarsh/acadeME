/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');

var DocumentTitle = require('../components/DocumentTitle');

var HomePage = React.createClass({

  render: function() {
    return (
      <section className="home-page">

        <DocumentTitle title="My Curriculum" />

        Home

      </section>
    );
  }

});

module.exports = React.createFactory(HomePage);