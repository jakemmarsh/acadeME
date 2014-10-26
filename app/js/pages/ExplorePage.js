/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var SearchPage = React.createClass({

  propTypes: {
    updatePageTitle: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : ''
    };
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({
        query: this.props.query.q
      });
    }
  },

  componentDidMount: function() {
    this.props.updatePageTitle('Explore Courses');
  },

  render: function() {
    return (
      <section className="explore-page">
        Explore Courses
      </section>
    );
  }

});

module.exports = SearchPage;