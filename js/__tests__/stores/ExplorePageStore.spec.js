'use strict';

var ExplorePageStore = require('../../../js/stores/ExplorePageStore');
var PageActions      = require('../../../js/actions/PageActions');

describe('Store: ExplorePage', function() {

  beforeEach(function(done) {
    this.timeout(10000);
    ExplorePageStore.courses = {
      newest: [],
      trending: [],
      results: []
    };
    done();
  });

  it('should be empty on init', function(done) {
    ExplorePageStore.courses.should.be.instanceOf(Object);
    ExplorePageStore.courses.should.have.property('newest');
    ExplorePageStore.courses.should.have.property('trending');
    ExplorePageStore.courses.should.have.property('results');
    ExplorePageStore.courses.newest.length.should.equal(0);
    ExplorePageStore.courses.trending.length.should.equal(0);
    ExplorePageStore.courses.results.length.should.equal(0);
    done();
  });

  it('should load initial courses on action', function(done) {
    PageActions.openExplore(function(err) {
      (err === null).should.be.true; // jshint ignore:line
      ExplorePageStore.courses.should.be.instanceOf(Object);
      ExplorePageStore.courses.should.have.property('newest');
      ExplorePageStore.courses.should.have.property('trending');
      ExplorePageStore.courses.newest.length.should.be.above(0);
      ExplorePageStore.courses.trending.length.should.be.above(0);
      done();
    });
  });

  it('should get results on action', function(done) {
    PageActions.searchAllCourses('computer', function(err) {
      (err === null).should.be.true; // jshint ignore:line
      ExplorePageStore.courses.should.be.instanceOf(Object);
      ExplorePageStore.courses.should.have.property('results');
      ExplorePageStore.courses.results.length.should.be.above(0);
      done();
    });
  });

});