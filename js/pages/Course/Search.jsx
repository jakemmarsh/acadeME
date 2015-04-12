'use strict';

var React             = require('react/addons');
var ReactAsync        = require('react-async');
var Reflux            = require('reflux');
var _                 = require('lodash');

var CourseActions     = require('../../actions/CourseActions');
var CourseSearchStore = require('../../stores/CourseSearchStore'); // Has to be required since it isn't anywhere else
var LessonSnippet     = require('../../components/LessonSnippet.jsx');

var CourseSearch = React.createClass({

  mixins: [ReactAsync.Mixin, Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  getInitialStateAsync: function(cb) {
    // TODO: figure out why this.props.query is empty, resulting in different render results from server vs client
    if ( this.props.query.q && this.props.query.q.length ) {
      CourseActions.search(this.props.params.courseId, this.props.query.q, function(err, results) {
        cb(null, {
          loading: false,
          query: this.props.query.q.replace(/(\+)|(%20)/gi, ' '),
          results: results || []
        });
      }.bind(this));
    } else {
      cb(null, {
        loading: false,
        query: '',
        results: []
      });
    }
  },

  _doSearch: function() {
    this.setState({
      loading: true
    }, function() {
      CourseActions.search(this.props.params.courseId, this.state.query, this._onResultsChange);
    }.bind(this));
  },

  _onResultsChange: function(err, results) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else {
      this.setState({ loading: false, results: results || [] });
    }
  },

  componentDidMount: function() {
    if ( this.props.query.q && this.props.query.q.length ) {
      this.setState({ query: this.props.query.q }, this._doSearch);
    }
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({ query: this.props.query.q }, this._doSearch);
    }
  },

  renderResults: function() {
    if ( this.state && this.state.results ) {
      return _.map(this.state.results, function(lesson, index) {
        return (
          <LessonSnippet currentUser={this.props.currentUser}
                         course={this.props.course}
                         lesson={lesson}
                         key={index} />
        );
      }.bind(this));
    }
  },

  render: function() {
    return (
      <div className="island">

        <h2 className="page-title nudge-half--bottom">
          Results for: {this.props.query && this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : ''}
        </h2>

        {this.renderResults()}

      </div>
    );
  }

});

module.exports = CourseSearch;