/**
 * @jsx React.DOM
 */
'use strict';

var React   = require('react');

var TopMenu = require('../components/TopMenu');

var CoursePage = React.createClass({

  componentDidMount: function() {
    this.props.setCourse({
      title: 'Human-Computer Interaction',
      instructor: {
        name: 'Joe Black'
      },
      percentageComplete: 35
    });
  },

  render: function() {
    return (
      <section className="course-page">
        <TopMenu />
        Course
      </section>
    );
  }

});

module.exports = CoursePage;