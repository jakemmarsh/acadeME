'use strict';

var React = require('react/addons');

var Html = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    markup: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      title: '',
      markup: ''
    };
  },

  render: function() {
    var title = this.props.title ? this.props.title += ' \u2014 acadeME' : 'acadeME';

    return (
      <html className="no-js" lang="">

        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content="" />
          <meta name="viewport" content="width=device-width" />

          <title>{title}</title>

          <link rel="stylesheet" href="css/main.css" />
          <script src="js/main.js"></script>
        </head>

        <body dangerouslySetInnerHTML={{ __html: this.props.markup }} />

      </html>
    );
  }

});

module.exports = Html;