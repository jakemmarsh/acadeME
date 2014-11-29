/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var ActiveState        = require('react-router').ActiveState;

var CurrentCourseStore = require('./stores/CurrentCourseStore');
var Header             = require('./components/Header');
var Sidebar            = require('./components/Sidebar');
var Footer             = require('./components/Footer');

var App = React.createClass({

  mixins: [ActiveState, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  _onCourseChange: function(course) {
    this.setState({
      currentCourse: course
    });
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this._onCourseChange({});
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentCourseStore, this._onCourseChange);
  },

  updatePageTitle: function(title) {
    var newPageTitle = '';

    if ( title ) {
      newPageTitle += title;
      newPageTitle += ' \u2014 ';
    }

    newPageTitle += 'App Name';

    document.title = newPageTitle;
  },

  render: function() {
    return (
      <div>

        <Header />

        <div className="body-container">
          <Sidebar course={this.state.currentCourse} />
          <div className="content-container">
            <this.props.activeRouteHandler currentUser={this.state.currentUser}
                                           updatePageTitle={this.updatePageTitle}
                                           course={this.state.currentCourse} />
          </div>
        </div>

        <Footer />

      </div>
    );
  }

});

module.exports = React.createFactory(App);