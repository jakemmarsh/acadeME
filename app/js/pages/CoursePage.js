/**
 * @jsx React.DOM
 */
'use strict';

var React   = require('react');

var TopMenu = require('../components/TopMenu');

var CoursePage = React.createClass({

  componentDidMount: function() {
    this.props.updatePageTitle(this.props.course.title);
  },

  render: function() {
    return (
      <section className="course-page">

        <TopMenu course={this.props.course} query={this.props.query.q} />

        <this.props.activeRouteHandler updatePageTitle={this.props.updatePageTitle}
                                       course={this.props.course} />

      </section>
    );
  }

});

module.exports = CoursePage;