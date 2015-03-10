/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var _                       = require('lodash');

var LayeredComponentMixin   = require('./LayeredComponentMixin');
var ChatActions             = require('../actions/ChatActions');
var CurrentAnnotationsStore = require('../stores/CurrentAnnotationsStore');
var Modal                   = require('../components/Modal.jsx');
var Spinner                 = require('../components/Spinner.jsx');

var AttachmentModalMixin = {

  mixins: [LayeredComponentMixin, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      attachment: {},
      showAttachmentModal: false,
      loading: false,
      annotations: [],
      error: null
    };
  },

  _onAnnotationsChange: function(err, annotations) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ annotations: annotations, loading: false, error: null });
    }
  },

  componentDidMount: function() {
    this.listenTo(CurrentAnnotationsStore, this._onAnnotationsChange);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if ( !_.isEmpty(nextState.attachment) && !_.isEqual(this.state.attachment, nextState.attachment) ) {
      ChatActions.openAttachment(nextState.attachment.id, this._onAnnotationsChange);
    }
  },

  showAttachmentModal: function(attachment) {
    this.setState({
      attachment: attachment,
      showAttachmentModal: true
    });
  },

  hideAttachmentModal: function() {
    this.setState({
      attachment: {},
      showAttachmentModal: false
    });
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={10} />
      );
    }

    return element;
  },

  renderAttachment: function() {
    var element = null;

    if ( !_.isEmpty(this.state.attachment) ) {
      console.log('render attachment:', this.state.attachment);
    }

    return element;
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showAttachmentModal ) {
      element = (
        <Modal className="attachment-modal" onRequestClose={this.hideAttachmentModal}>

          attachment

          {this.renderAttachment()}

        </Modal>
      );
    }

    return element;
  },

};

module.exports = AttachmentModalMixin;