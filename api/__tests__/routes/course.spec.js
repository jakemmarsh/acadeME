'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('course routes', function() {

  var url = 'http://localhost:3000/api/';

  it('should retrieve a single course by ID', function(done) {
    var req = request(url).get('course/1');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Object);
      res.body.should.have.property('title');
      res.body.should.have.property('slug');
      res.body.should.have.property('description');
      done();
    });
  });

  it('should add percent user completion to results', function(done) {
    var req = request(url).get('course/1');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.body.should.have.property('percentageCompleted');
      res.body.should.have.property('lessonsCompleted');
      done();
    });
  });

  it('should return an array of all courses', function(done) {
    var req = request(url).get('course');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('title');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('description');
      done();
    });
  });

  it('should return courses a specific user is enrolled in', function(done) {
    var req = request(url).get('course/user/2');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('title');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('description');
      done();
    });
  });

  it('should return an array of newest courses', function(done) {
    var req = request(url).get('course/newest');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('title');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('description');
      done();
    });
  });

  it('should return an array of trending courses', function(done) {
    var req = request(url).get('course/trending');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('title');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('description');
      done();
    });
  });

  it('should create and return a new course', function(done) {
    var req = request(url).post('course');
    var course = {
      title: 'Test Title',
      description: 'Test Description'
    };

    req.cookies = global.cookies;

    req.send(course).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('title');
      res.body.should.have.property('description');
      done();
    });
  });

  it('should enroll the current user', function(done) {
    var req = request(url).post('course/1/enroll');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });

  it('should unenroll the current user', function(done) {
    var req = request(url).del('course/1/enroll');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });

  it('should search all courses', function(done) {
    var req = request(url).get('course/search/interaction');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('title');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('description');
      done();
    });
  });

  it('should search within a specific course', function(done) {
    var req = request(url).get('course/1/search/interaction');

    req.cookies = global.cookies;

    req.end(function() {
      // TODO: finish this logic once endpoint logic is finished
      done();
    });
  });

  it('should create a new lesson', function(done) {
    var req = request(url).post('course/1/lesson');
    var lesson = {
      title: 'Test Title',
      description: 'Test Description',
      imageUrl: 'http://www.google.com/logo.png',
      bodyElements: []
    };

    req.cookies = global.cookies;

    req.send(lesson).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('title');
      res.body.should.have.property('description');
      res.body.should.have.property('bodyElements');
      done();
    });
  });

  it('should create a new quiz', function(done) {
    var quiz = {
      description: 'This is a description of a quiz.',
      tags: ['foo', 'bar', 'buzz'],
      numQuestions: 10
    };

    request(url)
    .post('course/1/lesson/1/quiz')
    .send(quiz)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('description');
      res.body.should.have.property('tags');
      done();
    });
  });

});