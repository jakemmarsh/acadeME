/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var CourseSearch = React.createClass({

  propTypes: {
    course: React.PropTypes.object.isRequired
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

  render: function() {
    return (
      <div>
        Search in course for: {this.state.query}
      </div>
    );
  }

});

module.exports = React.createFactory(CourseSearch);