'use strict';

var React        = require('react/addons');
var $            = require('jquery');
var SirTrevor;

var Editor = React.createClass({

  propTypes: {
    save: React.PropTypes.func.isRequired
  },

  componentDidMount: function() {
    var options = {
      el: $(this.refs.textarea.getDOMNode()),
      defaultType: 'Text',
      required: ['Text'],
      blockTypes: ['Text', 'Image', 'Video', /*'List',*/ 'Heading', 'Quote']
    };

    SirTrevor = require('sir-trevor');

    new SirTrevor.Editor(options);
  },

  saveForm: function() {
    var instance = SirTrevor.getInstance(0);

    // Run validations and serialize data
    instance.onFormSubmit();

    // Retrieve data and pass to function
    this.props.save(instance.dataStore.data);
  },

  render: function() {
    return (
      <div>

        <form>
          <textarea ref="textarea"></textarea>
        </form>

        <a className="button float-right nudge--bottom" onClick={this.saveForm}>Save Lesson</a>

      </div>
    );
  }

});

module.exports = Editor;