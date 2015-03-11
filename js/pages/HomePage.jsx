'use strict';

var React         = require('react/addons');
var ReactAsync    = require('react-async');
var DocumentTitle = require('react-document-title');

var HomePage = React.createClass({

  mixins: [ReactAsync.Mixin],

  getInitialStateAsync: function(cb) {
    console.log('get initial state in HomePage.jsx');
    cb(null, {
      courses: []
    });
  },

  render: function() {
    return (
      <DocumentTitle title="My Curriculum">
        <section className="home-page">

          Home

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = React.createFactory(HomePage);