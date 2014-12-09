/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var _          = require('lodash');
var Navigation = require('react-router').Navigation;
var Link       = React.createFactory(require('react-router').Link);

var ListLink = require('./ListLink');

var TopMenu = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object,
    course: React.PropTypes.object,
    query: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      currentUser : {},
      course: {
        instructor: {}
      }
    };
  },

  getInitialState: function() {
    return {
      query: this.props.query || ''
    };
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( (keyCode === '13' || keyCode === 13) && !_.isEmpty(this.props.course) ) {
      this.transitionTo('CourseSearch', { courseId: this.props.course.id }, { q: this.state.query });
    }
  },

  renderCreateButton: function() {
    var element = null;

    // TODO: remove true
    if ( true || this.props.course.instructor.id === this.props.currentUser.id ) {
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
    var element = null;

    if ( !_.isEmpty(this.props.course) ) {
      element = (
        <ul className="top-menu">

          {this.renderCreateButton()}

          <ListLink to="Course" params={ {courseId: this.props.course.id} }>
            <i className="fa fa-book" />
            Lessons
          </ListLink>

          <ListLink to="CourseChat" params={ {courseId: this.props.course.id} }>
            <i className="fa fa-comments" />
            Chat
          </ListLink>

          <li className="search-container">
            <i className="fa fa-search" />
            <input type="text"
                   className="search"
                   placeholder="Search in course..."
                   valueLink={this.linkState('query')}
                   onKeyPress={this.submitOnEnter} />
          </li>

        </ul>
      );
    }

    return element;
  }

});

module.exports = React.createFactory(TopMenu);