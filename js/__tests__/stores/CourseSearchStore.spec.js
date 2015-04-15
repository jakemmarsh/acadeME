'use strict';

var CourseSearchStore = require('../../../js/stores/CourseSearchStore');
var CourseActions     = require('../../../js/actions/CourseActions');

describe('Store: CourseSearch', function() {

  it('should be empty on init', function(done) {
    (CourseSearchStore.results === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should search within course on action', function(done) {
    CourseActions.search(1, 'rapid', function(err) {
      (err === null).should.be.true; // jshint ignore:line
      CourseSearchStore.results.should.be.instanceOf(Array);
      CourseSearchStore.results.length.should.be.above(0);
      CourseSearchStore.results[0].should.have.property('title');
      CourseSearchStore.results[0].should.have.property('description');
      CourseSearchStore.results[0].should.have.property('bodyElements');
      done();
    });
  });

});