'use strict';

var React = require('react/addons');

var Modal = React.createClass({

  propTypes: {
    onRequestClose: React.PropTypes.func.isRequired,
    title: React.PropTypes.string,
    className: React.PropTypes.string
  },

  killClick: function(e) {
    // clicks on the content shouldn't close the modal
    e.stopPropagation();
  },

  handleCloseClick: function() {
    // when you click the background, the user is requesting that the modal gets closed.
    // note that the modal has no say over whether it actually gets closed. the owner of the
    // modal owns the state. this just "asks" to be closed.
    this.props.onRequestClose();
  },

  renderHeader: function() {
    var element = null;

    if ( this.props.title ) {
      element = (
        <div className="header">
          <h3 className="flush text-left sans-serif">{this.props.title}</h3>
        </div>
      );
    }

    return element;
  },

  render: function() {
    var modalClasses = 'modal' + (this.props.className ? ' ' + this.props.className : '');

    return (
      <div className="modal-backdrop" onClick={this.handleCloseClick}>
        <div className="modal-container">
          <div className={modalClasses} onClick={this.killClick}>
            {this.renderHeader()}
            {this.props.children}
            <div className="close-button" onClick={this.handleCloseClick}>
              <i className="fa fa-remove" />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = React.createFactory(Modal);