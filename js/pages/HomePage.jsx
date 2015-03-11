'use strict';

var React         = require('react/addons');
var DocumentTitle = require('react-document-title');

var HomePage = React.createClass({

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