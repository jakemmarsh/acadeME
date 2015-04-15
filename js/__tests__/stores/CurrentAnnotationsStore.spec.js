'use strict';

var CurrentAnnotationsStore = require('../../../js/stores/CurrentAnnotationsStore');
var ChatActions             = require('../../../js/actions/ChatActions');

describe('Store: CurrentAnnotations', function() {

  it('should be empty on init', function(done) {
    (CurrentAnnotationsStore.annotations === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load annotations on action', function(done) {
    ChatActions.openAttachment(1, function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CurrentAnnotationsStore.annotations.should.be.instanceOf(Array);
      CurrentAnnotationsStore.annotations.length.should.be.above(0);
      CurrentAnnotationsStore.annotations[0].should.have.property('text');
      CurrentAnnotationsStore.annotations[0].should.have.property('xPos');
      CurrentAnnotationsStore.annotations[0].should.have.property('yPos');
      done();
    });
  });

  it('should save and add a new annotation on action', function(done) {
    var oldLength = CurrentAnnotationsStore.annotations.length;
    var annotation = {
      text: 'test',
      xPos: 5,
      yPos: 5
    };

    ChatActions.saveAnnotation(annotation, 1, function(err) {
      console.log('error:', err);
      (err === null).should.be.true; // jshint ignore:line
      CurrentAnnotationsStore.annotations.should.be.instanceOf(Array);
      CurrentAnnotationsStore.annotations.length.should.be.above(oldLength);
      done();
    });
  });

});