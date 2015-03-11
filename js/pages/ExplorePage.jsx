'use strict';

var React            = require('react/addons');
var ReactAsync       = require('react-async');
var Reflux           = require('reflux');
var _                = require('lodash');
var Navigation       = require('react-router').Navigation;
var DocumentTitle    = require('react-document-title');

var PageActions      = require('../actions/PageActions');
var ExplorePageStore = require('../stores/ExplorePageStore');
var TopMenu          = require('../components/TopMenu.jsx');
var CourseSnippet    = require('../components/CourseSnippet.jsx');

var ExplorePage = React.createClass({

  mixins: [ReactAsync.Mixin, React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialStateAsync: function(cb) {
    console.log('get initial state in ExplorePage.jsx');
    if ( this.props.query.q && this.props.query.q.length ) {
      PageActions.searchAllCourses(this.props.query.q, function(err, results) {
        cb(null, {
          loading: false,
          query: this.props.query.q.replace(/(\+)|(%20)/gi, ' '),
          courses: {
            newest: [],
            trending: [],
            results: results
          }
        });
      }.bind(this));
    } else {
      PageActions.openExplore(function(err, courses) {
        cb(null, {
          loading: false,
          query: '',
          courses: courses
        });
      });
    }
  },

  getInitialState: function() {
    return {
      loading: false,
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
      courses: {
        newest: [],
        trending: [],
        results: []
      }
    };
  },

  _onCoursesChange: function(err, courses) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else {
      this.setState({
        loading: false,
        courses: courses,
        error: null
      });
    }
  },

  _doSearch: function() {
    this.setState({
      loading: true
    }, function() {
      PageActions.searchAllCourses(this.state.query, this._onCoursesChange);
    }.bind(this));
  },

  componentDidMount: function() {
    if ( this.state.query && !this.state.courses.results ) {
      PageActions.searchAllCourses(this.props.query.q, this._onCoursesChange);
    } else if ( !this.state.courses.newest || !this.state.courses.trending ) {
      PageActions.openExplore(this._onCoursesChange);
    }
    this.listenTo(ExplorePageStore, this._onCoursesChange);
  },

  componentDidUpdate: function(prevProps) {
    var haveNewQuery = this.props.query.q && this.props.query.q.length && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({
        query: this.props.query.q
      }, this._doSearch);
    } else if ( !this.state.courses.newest.length || !this.state.courses.trending.length ) {
      PageActions.openExplore(this._onCoursesChange);
    }
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    console.log('submit on enter:', this.state.query);

    if ( (keyCode === '13' || keyCode === 13) ) {
      console.log('should replace with');
      if ( this.state.query.length ) {
        this.replaceWith('Explore', {}, { q: this.state.query });
      } else {
        this.replaceWith('Explore');
      }
    }
  },

  renderCourses: function(courses) {
    var element = null;

    if ( this.state.loading ) {
      console.log('element will be loading div');
      element = (
        <div>loading</div>
      );
    } else if ( courses && courses.length ) {
      element = _.map(courses, function(course, index) {
        return (
          <CourseSnippet key={index} course={course} />
        );
      });
    }

    return element;
  },

  renderInitialCourses: function() {
    var element = null;

    if ( !this.props.query.q ) {
      element = (
        <div>
          <h2 className="page-title nudge--top nudge-half--bottom">Newest Courses</h2>
          <div className="card">
            {this.renderCourses(this.state.courses.newest)}
          </div>
          <h2 className="page-title nudge--top nudge-half--bottom">Trending Courses</h2>
          <div className="card">
            {this.renderCourses(this.state.courses.trending)}
          </div>
        </div>
      );
    }

    return element;
  },

  renderSearchResults: function() {
    var element = null;

    if ( this.props.query.q ) {
      element = (
        <div>
          <h2 className="page-title nudge--top nudge-half--bottom">Results for {this.props.query.q.replace(/(\+)|(%20)/gi, ' ')}</h2>
          <div className="card">
            {this.renderCourses(this.state.courses.results)}
          </div>
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <DocumentTitle title="Explore">
        <section className="explore-page">

          <TopMenu>
            <li className="search-container">
              <i className="fa fa-search" />
              <input type="text"
                     className="search"
                     placeholder="Search for courses..."
                     valueLink={this.linkState('query')}
                     onKeyPress={this.submitOnEnter} />
            </li>
          </TopMenu>

          <div className="courses-container soft--sides soft--bottom">
            {this.props.query.q ? this.renderSearchResults() : this.renderInitialCourses()}
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = React.createFactory(ExplorePage);