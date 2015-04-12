'use strict';

var request = require('supertest');

require('../../../spec/support/createAuthenticatedSuite')('quiz routes', function() {

  var url = 'http://localhost:3000';

  it('should suggest questions', function(done) {
    request(url)
    .get('/api/quiz/suggestions?tags=test,lorem,ipsum')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.be.instanceof(Array);
      res.body[0].should.have.property('body');
      res.body[0].should.have.property('Answers');
      done();
    });
  });

  it('should save a new question', function(done) {
    var question = {
      type: 'multi',
      body: 'This is the body of a question?'
    };

    request(url)
    .post('/api/quiz/1/question')
    .send(question)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('body');
      done();
    });
  });

  it('should save new answers', function(done) {
    var answers = [
      {
        body: 'This is the correct answer.',
        isCorrect: true
      },
      {
        body: 'Answer.'
      },
      {
        body: 'Another answer.'
      },
      {
        body: 'Last but not least.'
      }
    ];

    request(url)
    .post('/api/quiz/1/question/2/answers')
    .send(answers)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });

  it('should mark a quiz as started', function(done) {
    request(url)
    .post('/api/quiz/1/begin')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.quiz.should.be.an.instanceOf(Object); // Ensure quiz has been set in session
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should recognize a correct answer and increment user\'s score', function(done) {
    var req = request(url).post('/api/quiz/1/check/1');

    req.cookies = global.cookies;

    req.send({ answer: 'Augusta' }).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.score.should.be.equal(1); // Ensure quiz has been incremented in session
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should retrieve the next question when prompted', function(done) {
    var req = request(url).get('/api/quiz/1/question');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('body');
      res.body.Answers.should.be.instanceof(Array);
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should recognize an incorrect answer and decrement user\'s score', function(done) {
    var req = request(url).post('/api/quiz/1/check/1');

    req.cookies = global.cookies;

    req.send({ answer: 'Bangor' }).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.score.should.be.equal(0); // Ensure score has been decremented in session
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

  it('should mark a quiz as complete', function(done) {
    var req = request(url).post('/api/quiz/1/complete/lesson/1');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

});