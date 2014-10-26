/**
 * @jsx React.DOM
 */
'use strict';

var React      = require('react/addons');
var Navigation = require('react-router').Navigation;

var ListLink = require('./ListLink');

var TopMenu = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    course: React.PropTypes.object.isRequired,
    query: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      query: this.props.query || ''
    };
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.transitionTo('CourseSearch', { courseId: this.props.course.id }, { q: this.state.query });
    }
  },

  render: function() {
    return (
      <ul className="top-menu">
        <ListLink to="Course" params={ {courseId: this.props.course.id } }>
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

});

module.exports = TopMenu;