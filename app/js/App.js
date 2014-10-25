/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var ActiveState = require('react-router').ActiveState;

var Header      = require('./components/Header');
var Sidebar     = require('./components/Sidebar');
var Footer      = require('./components/Footer');

var App = React.createClass({

  mixins: [ActiveState],

  getInitialState: function() {
    return {
      course: {}
    };
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this.setCourse(null);
    }
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

  setCourse: function(course) {
    this.setState({
      course: course
    });
  },

  render: function() {
    return (
      <div>

        <Header />

        <div className="body-container">
          <Sidebar course={this.state.course} />
          <div className="content-container">
            <this.props.activeRouteHandler updatePageTitle={this.updatePageTitle} setCourse={this.setCourse} />
          </div>
        </div>

        <Footer />

      </div>
    );
  }

});

module.exports = App;