/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');

var QuizActions = require('../actions/QuizActions');
var ProgressBar = require('./ProgressBar');

var Quiz = React.createClass({

  propTypes: {
    quiz: React.PropTypes.object.isRequired,
    flagQuizComplete: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      quiz: {}
    };
  },

  getInitialState: function() {
    return {
      question: null,
      userScore: 0,
      currentQuestionNumber: 0,
      quizComplete: false
    };
  },

  _onAnswerCheck: function(result) {
    var newScore = this.state.userScore;

    // TODO: more complex algorithm for scoring
    if ( result.isCorrect ) {
      newScore++;
    } else {
      newScore--;
    }

    this.setState({ userScore: newScore }, this.getNextQuestion);
  },

  _onQuestionChange: function(question) {
    if ( question ) {
      this.setState({
        question: question,
        currentQuestionNumber: this.state.currentQuestionNumber + 1
      });
    }
  },

  componentWillMount: function() {
    this.getNextQuestion();
  },

  checkAnswer: function() {
    QuizActions.checkAnswer(this.state.question.id, this.state.answer, this._onAnswerCheck);
  },

  getNextQuestion: function() {
    if ( this.state.currentQuestionNumber < this.props.quiz.numQuestions ) {
      QuizActions.loadQuestion(this.props.quiz.id, this.state.currentQuestionNumber, this.state.userScore, this._onQuestionChange);
    } else {
      this.setState({ quizComplete: true }, this.props.flagQuizComplete);
    }
  },

  renderIntro: function() {
    var element = null;

    if ( this.state.currentQuestionNumber === 0 ) {
      element = (
        <div />
      );
    }

    return element;
  },

  renderProgressBar: function() {
    var element = null;
    var percentage = (this.state.currentQuestionNumber/this.props.quiz.numQuestions)*100;

    if ( this.state.currentQuestionNumber > 0 ) {
      element = (
        <ProgressBar percentage={percentage} />
      );
    }

    return element;
  },

  renderCurrentQuestion: function() {
    var element = null;

    if ( this.state.question && this.state.currentQuestionNumber > 0 ) {
      element = (
        <div />
      );
    }

    return element;
  },

  renderFinishedScreen: function() {
    var element = null;

    if ( this.state.quizComplete ) {
      element = (
        <div />
      );
    }

    return element;
  },

  render: function() {
    return (
      <div className="quiz">

        {this.renderIntro()}

        {this.renderProgressBar()}

        (this.renderCurrentQuestion())

        {this.renderFinishedScreen()}

      </div>
    );
  }

});

module.exports = React.createFactory(Quiz);