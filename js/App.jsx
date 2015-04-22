'use strict';

var React            = require('react/addons');
var ReactAsync       = require('react-async');
var Preloaded        = ReactAsync.Preloaded;
var Reflux           = require('reflux');
var Navigation       = require('react-router').Navigation;
var State            = require('react-router').State;
var RouteHandler     = require('react-router').RouteHandler;

var UserActions      = require('./actions/UserActions');
var CurrentUserStore = require('./stores/CurrentUserStore');
var Header           = require('./components/Header.jsx');
var Sidebar          = require('./components/Sidebar.jsx');
var Footer           = require('./components/Footer.jsx');


var App = React.createClass({

  mixins: [ReactAsync.Mixin, Navigation, State, Reflux.ListenerMixin],

  propTypes: {
    params: React.PropTypes.object,
    query: React.PropTypes.object
  },

  getInitialStateAsync: function(cb) {
    console.log('get initial state in app.jsx');
    UserActions.check(function(err, user) {
      console.log('user after async state call:', user);
      cb(null, {
        currentUser: user || {},
        currentCourse: {}
      });
    });
  },

  _onUserChange: function(err, user) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ currentUser: user || {}, error: null });
    }
  },

  componentWillReceiveProps: function() {
    if ( !this.isActive('Course') ) {
      this.setCourse({});
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentUserStore, this._onUserChange);
  },

  setCourse: function(course) {
    this.setState({ currentCourse: course });
  },

  isInnerPage: function() {
    return !this.isActive('Register');
  },

  renderSidebar: function() {
    var element = null;

    if ( this.isInnerPage() ) {
      element = (
        <Sidebar currentUser={this.state.currentUser}
                 course={this.state.currentCourse} />
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

          <Header currentUser={this.state.currentUser} />

          <div className="body-container">
            {this.renderSidebar()}
            <div className="content-container">
              <Preloaded>
                <RouteHandler params={this.props.params}
                              query={this.props.query}
                              currentUser={this.state.currentUser}
                              setCourse={this.setCourse} />
              </Preloaded>
            </div>
          </div>

          <Footer currentUser={this.state.currentUser} />

      </div>
    );
  }

});

module.exports = App;