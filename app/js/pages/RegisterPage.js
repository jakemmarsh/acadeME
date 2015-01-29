/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var _             = require('lodash');
var Navigation    = require('react-router').Navigation;

var DocumentTitle = require('../components/DocumentTitle');

var RegisterPage = React.createClass({

  mixins: [Navigation],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  componentWillReceiveProps: function(nextProps) {
    if ( this.isMounted() && !_.isEmpty(nextProps.currentUser) ) {
      this.replaceWith('Home');
    }
  },

  render: function() {
    return (
      <section className="register-page">

        <DocumentTitle title="Register" />

        Register

      </section>
    );
  }

});

module.exports = React.createFactory(RegisterPage);