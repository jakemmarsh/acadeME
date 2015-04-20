'use strict';

var request = require('supertest');

require('../../../utils/createAuthenticatedSuite')('quiz routes', function() {

  var url = 'http://localhost:3000/api/';

  it('should suggest questions', function(done) {
    request(url)
    .get('quiz/suggestions?tags=test,lorem,ipsum')
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
      body: 'This is the body of a question?',
      difficulty: 5
    };

    request(url)
    .post('quiz/1/question')
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
    .post('quiz/1/question/2/answers')
    .send(answers)
    .end(function(err, res) {
      res.status.should.be.equal(200);
      done();
    });
  });

  it('should mark a quiz as started', function(done) {
    request(url)
    .post('quiz/1/begin')
    .end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.quiz.should.be.instanceOf(Object); // Ensure quiz has been set in session
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      setTimeout(done, 500);
    });
  });

  it('should retrieve the next question when prompted', function(done) {
    var req = request(url).get('quiz/1/question');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('body');
      res.body.Answers.should.be.instanceof(Array);
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      setTimeout(done, 500); // Wait to ensure that req.session.quiz.currentQuestion is updated before next test
    });
  });

  it('should recognize a correct answer and increment user\'s score', function(done) {
    var req = request(url).post('quiz/1/check/1');

    req.cookies = global.cookies;

    req.send({ answer: '0' }).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.score.should.be.above(50); // Ensure quiz has been incremented in session
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      setTimeout(done, 500);
    });
  });

  it('should retrieve a harder question after a correct answer', function(done) {
    var req = request(url).get('quiz/1/question');

    req.cookies = global.cookies;

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.should.have.property('body');
      res.body.Answers.should.be.instanceof(Array);
      res.body.difficulty.should.be.above(5);
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      setTimeout(done, 500); // Wait to ensure that req.session.quiz.currentQuestion is updated before next test
    });
  });

  it('should recognize an incorrect answer and decrement user\'s score', function(done) {
    var req = request(url).post('quiz/1/check/1');

    req.cookies = global.cookies;

    req.send({ answer: 'Bangor' }).end(function(err, res) {
      res.status.should.be.equal(200);
      res.body.score.should.be.below(50); // Ensure score has been decremented in session (50 is starting score)
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      setTimeout(done, 500);
    });
  });

  it('should mark a quiz as complete', function(done) {
    var req = request(url).post('quiz/1/complete/lesson/1');

    req.cookies = global.cookies;

    // TODO: figure out why this is always hitting a 401, no req.user

    req.end(function(err, res) {
      res.status.should.be.equal(200);
      global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      done();
    });
  });

});