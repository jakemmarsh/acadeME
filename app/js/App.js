/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var ActiveState = require('react-router').ActiveState;

var Header      = require('./components/Header');
var Sidebar     = require('./components/Sidebar');
var Footer      = require('./components/Footer');

var testCourse = {
  id: 0,
  title: 'Human-Computer Interaction',
  instructor: {
    name: 'Joe Black'
  },
  percentageComplete: 35,
  lessons: [
    {
      id: 0,
      title: 'Rapid Prototyping',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus. Vivamus nec sem vitae sem suscipit tempus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      image_url: ''
    },
    {
      id: 1,
      title: 'Heuristic Evaluation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel ante finibus, dictum nisi et, dictum mi. Nam lobortis consequat purus sit amet mattis. Nam at tincidunt risus.',
      image_url: ''
    }
  ]
};

var App = React.createClass({

  mixins: [ActiveState],

  getInitialState: function() {
    return {
      course: testCourse
    };
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this.setCourse(null);
    } else {
      this.setCourse(testCourse);
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

  setCourse: function(course, cb) {
    this.setState({
      course: course
    }, cb);
  },

  render: function() {
    return (
      <div>

        <Header />

        <div className="body-container">
          <Sidebar course={this.state.course} />
          <div className="content-container">
            <this.props.activeRouteHandler updatePageTitle={this.updatePageTitle}
                                           setCourse={this.setCourse}
                                           course={this.state.course} />
          </div>
        </div>

        <Footer />

      </div>
    );
  }

});

module.exports = App;