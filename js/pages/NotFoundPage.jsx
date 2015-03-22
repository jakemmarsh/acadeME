'use strict';

var React         = require('react/addons');
var DocumentTitle = require('react-document-title');

var NotFoundPage = React.createClass({

  render: function() {
    return (
      <DocumentTitle title="Not Found">
        <section className="not-found-page">

          Page Not Found

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = NotFoundPage;