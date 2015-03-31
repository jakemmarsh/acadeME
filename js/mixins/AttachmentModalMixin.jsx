'use strict';

require('annotorious');

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var _                       = require('lodash');

var LayeredComponentMixin   = require('./LayeredComponentMixin');
var ChatActions             = require('../actions/ChatActions');
var CurrentAnnotationsStore = require('../stores/CurrentAnnotationsStore');
var Modal                   = require('../components/Modal');
var Spinner                 = require('../components/Spinner');

var AttachmentModalMixin = {

  mixins: [LayeredComponentMixin, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      attachment: {},
      showAttachmentModal: false,
      loading: false,
      attachmentAnnotations: [],
      error: null
    };
  },

  _onAnnotationsChange: function(err, annotations) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({
        attachmentAnnotations: annotations,
        loading: false,
        error: null
      });
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

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showAttachmentModal ) {
      element = (
        <Modal className="attachment-modal" onRequestClose={this.hideAttachmentModal}>

          <img src={this.state.attachment.url} id="attachment" />

        </Modal>
      );
    }

    return element;
  },

};

module.exports = AttachmentModalMixin;