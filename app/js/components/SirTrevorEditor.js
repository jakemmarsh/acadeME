/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var $            = require('jquery');
window.jQuery    = $; // to avoid undefined errors in SirTrevor
window._         = require('underscore'); // to avoid undefined errors in SirTrevor
window.Eventable = require('eventablejs/eventable'); // to avoid undefined errors in SirTrevor
require('sir-trevor');

console.log(window.SirTrevor);

var SirTrevorEditor = React.createClass({

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

    new window.SirTrevor.Editor(options);
  },

  saveForm: function() {
    var data = window.SirTrevor.getInstance().onFormSubmit();

    console.log(data);
    //this.props.save(data);
  },

  render: function() {
    return (
      <div>

        <form>
          <textarea ref="textarea"></textarea>
        </form>

        <a className="button float-right" onClick={this.saveForm}>Save Lesson</a>

      </div>
    );
  }

});

module.exports = React.createFactory(SirTrevorEditor);