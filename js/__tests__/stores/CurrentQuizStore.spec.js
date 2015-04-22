'use strict';

var CurrentQuizStore = require('../../../js/stores/CurrentQuizStore');
var LessonActions    = require('../../../js/actions/LessonActions');
var QuizActions    = require('../../../js/actions/QuizActions');

require('../../../utils/createAuthenticatedSuite')('Store: Quiz', function() {

  it('should be empty on init', function(done) {
    (CurrentQuizStore.quiz === null).should.be.true; // jshint ignore:line
    done();
  });

  it('should load a quiz on action', function(done) {
    LessonActions.openQuiz(1, function(err, quiz) {
      (err === null).should.be.true; // jshint ignore:line
      quiz.should.be.instanceOf(Object);
      quiz.should.have.property('description');
      quiz.should.have.property('tags');
      quiz.should.have.property('numQuestions');
      done();
    });
  });

  it('should mark a quiz started on action', function(done) {
    QuizActions.begin(1, done);
  });

  it('should load a question on action', function(done) {
    QuizActions.getQuestion(1, function(err, question) {
      (err === null).should.be.true; // jshint ignore:line
      question.should.be.instanceOf(Object);
      question.should.have.property('body');
      question.should.have.property('type');
      question.should.have.property('difficulty');
      question.should.have.property('answers');
      done();
    });
  });

  it('check an answer on action', function(done) {
    QuizActions.checkAnswer(1, '0', function(err, result) {
      (err === null).should.be.true; // jshint ignore:line
      result.should.be.instanceOf(Object);
      result.should.have.property('isCorrect');
      result.should.have.property('score');
      done();
    });
  });

  it('mark a quiz finished on action', function(done) {
    QuizActions.markComplete(1, 1, done);
  });

});