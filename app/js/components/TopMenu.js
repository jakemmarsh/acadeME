/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var _          = require('underscore');
var Navigation = require('react-router').Navigation;

var ListLink = require('./ListLink');

var TopMenu = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    course: React.PropTypes.object,
    query: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
        course: {}
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

  render: function() {
    var element = null;

    if ( !_.isEmpty(this.props.course) ) {
      element = (
        <ul className="top-menu">
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

module.exports = TopMenu;