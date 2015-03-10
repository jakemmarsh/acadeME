/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react');
var _             = require('lodash');
var RouteHandler  = React.createFactory(require('react-router').RouteHandler);
var Link          = React.createFactory(require('react-router').Link);

var DocumentTitle = require('../components/DocumentTitle.jsx');
var CourseActions = require('../actions/CourseActions');
var ListLink      = require('../components/ListLink.jsx');
var TopMenu       = require('../components/TopMenu.jsx');

var CoursePage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

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

  getInitialState: function() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : ''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( _.isEmpty(this.props.course) || this.props.params.courseId !== nextProps.params.courseId ) {
      CourseActions.openCourse(nextProps.params.courseId.toString());
    }
  },

  componentWillMount: function() {
    CourseActions.openCourse(this.props.params.courseId.toString());
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( (keyCode === '13' || keyCode === 13) && !_.isEmpty(this.props.course) ) {
      this.transitionTo('CourseSearch', { courseId: this.props.course.id }, { q: this.state.query });
    }
  },

  renderCreateButton: function() {
    var element = null;

    if ( !_.isEmpty(this.props.course) && this.props.course.instructor.id === this.props.currentUser.id ) {
      element = (
        <li className="create-lesson-button">
          <i className="fa fa-plus" />
          <Link to="CreateLesson" params={{ courseId: this.props.course.id }} />
        </li>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="course-page">

        <DocumentTitle title={this.props.course ? this.props.course.title : ''} />

        <TopMenu>
          <li className="search-container">
            <i className="fa fa-search" />
            <input type="text"
                   className="search"
                   placeholder="Search in course..."
                   valueLink={this.linkState('query')}
                   onKeyPress={this.submitOnEnter} />
          </li>
          <ListLink to="Course" params={ {courseId: this.props.course.id || 0} }>
            <i className="fa fa-book" />
            Lessons
          </ListLink>
          <ListLink to="CourseChat" params={ {courseId: this.props.course.id || 0} }>
            <i className="fa fa-comments" />
            Chat
          </ListLink>
          {this.renderCreateButton()}
        </TopMenu>

        <RouteHandler params={this.props.params}
                      query={this.props.query}
                      currentUser={this.props.currentUser}
                      updatePageTitle={this.props.updatePageTitle}
                      course={this.props.course} />

      </section>
    );
  }

});

module.exports = React.createFactory(CoursePage);