'use strict';

var React              = require('react');
var Reflux             = require('reflux');
var ReactAsync         = require('react-async');
var Preloaded          = ReactAsync.Preloaded;
var _                  = require('lodash');
var Router             = require('react-router');
var RouteHandler       = Router.RouteHandler;
var Link               = Router.Link;
var Navigation         = Router.Navigation;
var DocumentTitle      = require('react-document-title');

var CourseActions      = require('../actions/CourseActions');
var CurrentCourseStore = require('../stores/CurrentCourseStore');
var ListLink           = require('../components/ListLink.jsx');
var TopMenu            = require('../components/TopMenu.jsx');

var CoursePage = React.createClass({

  mixins: [ReactAsync.Mixin, React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialStateAsync: function(cb) {
    console.log('get initial state async CoursePage.jsx');
    CourseActions.openCourse(this.props.params.courseId.toString(), function(err, course) {
      cb(null, {
        query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
        course: course || {},
        userIsEnrolled: false
      });
    }.bind(this));
  },

  _onCourseChange: function(err, course) {
    if ( err ) {
      this.setState({ error: err.message });
    } else if ( !err ) {
      this.setState({ course: course || {}, error: null });
    }
  },

  _checkCourseStore: function() {
    var hasCourse = !_.isEmpty(this.state.course);
    var storeHasCourse = !_.isEmpty(CurrentCourseStore.course);
    var coursesNotEqual = !_.isEqual(this.state.course, CurrentCourseStore.course);

    if ( hasCourse && (!storeHasCourse || coursesNotEqual) ) {
      CourseActions.setCourse(this.state.course);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if ( this.props.params.courseId && this.props.params.courseId !== nextProps.params.courseId ) {
      CourseActions.openCourse(nextProps.params.courseId.toString());
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentCourseStore, this._onCourseChange);
    this._checkCourseStore();

    if ( this.props.query.q && this.props.query.q.length ) {
      this.setState({ query: this.props.query.q });
    }
  },

  componentDidUpdate: function(prevProps) {
    this._checkCourseStore();

    if ( this.props.query.q !== prevProps.query.q ) {
      this.setState({ query: this.props.query.q });
    }
  },

  userIsEnrolled: function() {
    if ( !_.isEmpty(this.state) && !_.isEmpty(this.state.course) ) {
      return this.state.userIsEnrolled || _.some(this.state.course.enrollments, function(enrollment) {
        return !_.isEmpty(this.props.currentUser) && enrollment.userId === this.props.currentUser.id;
      }.bind(this));
    } else {
      return false;
    }
  },

  enroll: function() {
    CourseActions.enroll(this.state.course.id, function() {
      this.setState({ userIsEnrolled: true });
    }.bind(this));
  },

  unEnroll: function() {
    CourseActions.unEnroll(this.state.course.id, function() {
      this.setState({ userIsEnrolled: false });
    }.bind(this));
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( (keyCode === '13' || keyCode === 13) && !_.isEmpty(this.state.course) ) {
      this.transitionTo('CourseSearch', { courseId: this.state.course.id }, { q: this.state.query });
    }
  },

  renderCreateButton: function() {
    var userIsInstructor = this.state.course.instructor.id === this.props.currentUser.id;
    var userIsEnrolled = this.userIsEnrolled();
    var iconClasses = '';
    var linkElement = null;

    if ( userIsInstructor ) {
      iconClasses = 'fa fa-plus';
      linkElement = (<Link to="CreateLesson" params={{ courseId: this.state.course.id }} />);
    } else if ( userIsEnrolled ) {
      iconClasses = 'fa fa-bookmark-o';
      linkElement = (<a onClick={this.unEnroll} />);
    } else if ( !userIsEnrolled ) {
      iconClasses = 'fa fa-bookmark';
      linkElement = (<a onClick={this.enroll} />);
    }

    return (
      <li className="special-action-button">
        <i className={iconClasses} />
        {linkElement}
      </li>
    );
  },

  render: function() {
    var haveUser = !_.isEmpty(this.props.currentUser);
    var haveCourse = !_.isEmpty(this.state.course);

    return (
      <DocumentTitle title={haveCourse ? this.state.course.title || 'acadeME' : 'acadeMe' }>
        <section className="course-page">

          <TopMenu>
            <li className="search-container">
              <i className="fa fa-search" />
              <input type="text"
                     className="search"
                     placeholder="Search in course..."
                     valueLink={this.linkState('query')}
                     onKeyPress={this.submitOnEnter} />
            </li>
            <ListLink to="Course" params={{ courseId: this.props.params.courseId }}>
              <i className="fa fa-book" />
              Lessons
            </ListLink>
            <ListLink to="CourseChat" params={{ courseId: this.props.params.courseId }}>
              <i className="fa fa-comments" />
              Chat
            </ListLink>
            {haveUser && haveCourse ? this.renderCreateButton() : null}
          </TopMenu>

          <Preloaded>
            <RouteHandler params={this.props.params}
                          query={_.assign({ q: this.state.query }, this.props.query)}
                          currentUser={this.props.currentUser}
                          updatePageTitle={this.props.updatePageTitle}
                          course={haveCourse ? this.state.course : {}} />
          </Preloaded>

        </section>
      </DocumentTitle>
    );
  }

});

module.exports = CoursePage;