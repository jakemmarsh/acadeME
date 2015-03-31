'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var _                       = require('lodash');
var ReactAnnotatorMixin     = require('../../../react-annotator').Mixin;

var LayeredComponentMixin   = require('./LayeredComponentMixin');
var ChatActions             = require('../actions/ChatActions');
var CurrentAnnotationsStore = require('../stores/CurrentAnnotationsStore');
var Modal                   = require('../components/Modal.jsx');
var Spinner                 = require('../components/Spinner.jsx');
var annotatorSettings       = {
  element: '#attachment'
};

var AttachmentModalMixin = {

  mixins: [LayeredComponentMixin, Reflux.ListenerMixin, ReactAnnotatorMixin(annotatorSettings)],

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
      }, function() {
        this.setAnnotations(this.state.attachmentAnnotations);
      }.bind(this));
    }
  },

  _saveAnnotationToDb: function(annotation) {
    ChatActions.saveAnnotation(annotation, this.state.attachment.id);
  },
  componentDidMount: function() {
    this.listenTo(CurrentAnnotationsStore, this._onAnnotationsChange);
    this.setAddCallback(this._saveAnnotationToDb);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if ( !_.isEmpty(nextState.attachment) && !_.isEqual(this.state.attachment, nextState.attachment) ) {
      ChatActions.openAttachment(nextState.attachment.id, this._onAnnotationsChange);
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    var haveNewAttachment = !_.isEmpty(this.state.attachment) && !_.isEqual(prevState.attachment, this.state.attachment);
    var pdfRegex = new RegExp('\.pdf', 'i');

    if ( haveNewAttachment ) {
      this.setAddCallback(this._saveAnnotationToDb);
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
    var haveAttachment = !_.isEmpty(this.state.attachment);
    var imageRegex = new RegExp('\.(png|jpg|jpeg|gif|bmp)', 'gi');
    var pdfRegex = new RegExp('\.pdf', 'gi');
    var styles = {
      'maxWidth': '100%',
      'maxHeight': 600
    };

    if ( haveAttachment && imageRegex.test(this.state.attachment.name) ) {
      element = (
        <img src={this.state.attachment.url} id="attachment-image" className="attachment" style={styles} />
      );
    } else if ( haveAttachment && pdfRegex.test(this.state.attachment.name) ) {
      element = (
        <canvas id="attachment-canvas" className="attachment" style={styles} />
      );
    }

    return element;
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showAttachmentModal ) {
      element = (
        <Modal className="attachment-modal" onRequestClose={this.hideAttachmentModal}>

          {this.renderAttachment()}

          {this.renderAnnotationIndicators()}

        </Modal>
      );
    }

    return element;
  },

};

module.exports = AttachmentModalMixin;