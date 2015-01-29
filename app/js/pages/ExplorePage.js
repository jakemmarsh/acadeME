/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var Reflux          = require('reflux');
var _               = require('lodash');

var DocumentTitle   = require('../components/DocumentTitle');
var CourseActions   = require('../actions/CourseActions');
var AllCoursesStore = require('../stores/AllCoursesStore');
var CourseSnippet   = require('../components/CourseSnippet');

var ExplorePage = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      courses: []
    };
  },

  _onCoursesChange: function(err, courses) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ courses: courses, error: null });
    }
  },

  componentDidMount: function() {
    CourseActions.loadAll(this._onCoursesChange);
    this.listenTo(AllCoursesStore, this._onCoursesChange);
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({ query: this.props.query.q });
    }
  },

  renderCourses: function() {
    var elements = null;

    if ( this.state.courses && this.state.courses.length ) {
      elements = _.map(this.state.courses, function(course, index) {
        return (
          <CourseSnippet key={index} course={course} />
        );
      });
    }

    return elements;
  },

  render: function() {
    return (
      <section className="explore-page">

        <DocumentTitle title="Explore" />

        Explore Courses: {this.state.query}

        <div className="courses-container">
          {this.renderCourses()}
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(ExplorePage);