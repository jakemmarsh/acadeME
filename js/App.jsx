/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var ReactAsync         = require('react-async');
var Reflux             = require('reflux');
var Navigation         = require('react-router').Navigation;
var State              = require('react-router').State;
var RouteHandler       = React.createFactory(require('react-router').RouteHandler);

var UserActions        = require('./actions/UserActions');
var CurrentUserStore   = require('./stores/CurrentUserStore');
var CurrentCourseStore = require('./stores/CurrentCourseStore');
var Header             = require('./components/Header.jsx');
var Sidebar            = require('./components/Sidebar.jsx');
var Footer             = require('./components/Footer.jsx');

var App = React.createClass({

  mixins: [ReactAsync.Mixin, Navigation, State, Reflux.ListenerMixin],

  getInitialStateAsync: function(cb) {
    console.log('inside get initial state async');
    UserActions.check(function(err, user) {
      console.log('after check, about to call cb');
      cb(null, {
        currentUser: user || {},
        course: {}
      });
    });
  },

  _onUserChange: function(err, user) {
    console.log('new user:', user);
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ currentUser: user || {}, error: null });
    }
  },

  _onCourseChange: function(err, course) {
    if ( err ) {
      this.setState({ error: err.message });
    } else if ( !err ) {
      this.setState({ currentCourse: course, error: null });
    }
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this._onCourseChangxe(null, null);
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentUserStore, this._onUserChange);
    this.listenTo(CurrentCourseStore, this._onCourseChange);
    console.log('app did mount');
  },

  isInnerPage: function() {
    return !this.isActive('Register');
  },

  renderSidebar: function() {
    var element = null;

    if ( this.isInnerPage() ) {
      element = (
        <Sidebar course={this.state.currentCourse} />
      );
    }

    return element;
  },

  render: function() {

    console.log('will render app');
    return (
      <html class="no-js" lang="">
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="description" content="" />
            <meta name="viewport" content="width=device-width" />

            <title>acadeME</title>

            <link rel="stylesheet" href="css/main.css" />
        </head>
        <body>

          <Header currentUser={this.state.currentUser} />

          <div className="body-container">
            {this.renderSidebar()}
            <div className="content-container">
              <RouteHandler params={this.props.params}
                            query={this.props.query}
                            currentUser={this.state.currentUser}
                            course={this.state.currentCourse} />
            </div>
          </div>

          <Footer />

          <script src="js/main.js"></script>

        </body>
      </html>
    );
  }

});

module.exports = React.createFactory(App);