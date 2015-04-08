'use strict';

var React   = require('react/addons');
var $       = require('jquery');

var Spinner = require('./Spinner.jsx');

var SirTrevor;

var Editor = React.createClass({

  propTypes: {
    save: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      loading: false
    };
  },

  componentDidMount: function() {
    var options = {
      el: $(this.refs.textarea.getDOMNode()),
      defaultType: 'Text',
      required: ['Text'],
      blockTypes: ['Text', 'Image', 'Video', /*'List',*/ 'Heading', 'Quote']
    };

    SirTrevor = require('sir-trevor');

    SirTrevor.setDefaults({
      uploadUrl: '/api/upload/sir-trevor'
    });

    SirTrevor.setBlockOptions('Video', {
      droppable: false,
      uploadable: false
    });

    new SirTrevor.Editor(options);
  },

  saveForm: function() {
    var instance = SirTrevor.getInstance(0);
    var store;

    this.setState({ loading: true });

    // Run validations and serialize data
    instance.onFormSubmit();
    store = instance.store.retrieve();

    // Retrieve data and pass to function
    this.props.save(store.data);
  },

  render: function() {
    return (
      <div>

        <form>
          <textarea ref="textarea"></textarea>
        </form>

        <button className="button float-right nudge--bottom" onClick={this.saveForm}>
          <Spinner loading={this.state.loading} />
          Save Lesson
        </button>

      </div>
    );
  }

});

module.exports = Editor;