/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var _           = require('lodash');
var Link        = React.createFactory(require('react-router').Link);

var QuizActions = require('../actions/QuizActions');
var ProgressBar = require('./ProgressBar.jsx');

var Quiz = React.createClass({

  propTypes: {
    lessonId: React.PropTypes.number.isRequired,
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
      quizComplete: false,
      selectedAnswer: {}
    };
  },

  _onAnswerCheck: function(result) {
    var newScore = this.state.userScore;

    // TODO: more complex algorithm for scoring
    if ( true || result ) {
      newScore++;
    } else {
      newScore--;
    }

    this.setState({ userScore: newScore }, this.getNextQuestion);
  },

  _onQuestionChange: function(err, question) {
    if ( err ) {
      // TODO: handle error
    } else if ( question ) {
      this.setState({
        question: question,
        currentQuestionNumber: this.state.currentQuestionNumber + 1,
        selectedAnswer: {}
      });
    }
  },

  // componentDidUpdate: function(prevProps) {
  //   console.log('did update:', this.props.quiz);
  //   if ( !_.isEmpty(this.props.quiz) && this.props.quiz.id !== prevProps.quiz.id ) {
  //     this.getNextQuestion();
  //   }
  // },

  selectAnswer: function(answer) {
    this.setState({ selectedAnswer: answer });
  },

  submitAnswer: function() {
    QuizActions.checkAnswer(this.state.question.id, this.state.selectedAnswer, this._onAnswerCheck);
  },

  getNextQuestion: function() {
    var numQuestions = this.props.quiz.questions ? this.props.quiz.questions.length : 0;

    console.log('get next question:', this.state.currentQuestionNumber, numQuestions);

    if ( this.state.currentQuestionNumber < numQuestions ) {
      QuizActions.getQuestion(this.props.quiz.id, this.state.currentQuestionNumber, this.state.userScore, this._onQuestionChange);
    } else {
      this.setState({
        currentQuestionNumber: this.state.currentQuestionNumber + 1,
        quizComplete: true
      }, this.props.flagQuizComplete);
    }
  },

  renderIntro: function() {
    var element = null;
    var numQuestions = this.props.quiz.questions ? this.props.quiz.questions.length : 0;
    var pluralized = (numQuestions === 0 || numQuestions > 1) ? 'questions' : 'question';

    if ( this.state.currentQuestionNumber === 0 ) {
      element = (
        <div className="intro-finish-container soft--sides">
          <div>
            <h1 className="title sans-serif flush--bottom">{this.props.quiz.title}</h1>
            <h6 className="primary serif italic weight--normal">{numQuestions} {pluralized}</h6>
          </div>
          <div>
            <a className="button soft--sides soft-half--ends" onClick={this.getNextQuestion}>Begin Quiz</a>
          </div>
        </div>
      );
    }

    return element;
  },

  renderProgressBar: function() {
    var element = null;
    var numQuestions = this.props.quiz.questions ? this.props.quiz.questions.length : 1;
    var percentage = ((this.state.currentQuestionNumber-1)/numQuestions)*100;

    if ( this.state.currentQuestionNumber > 0 ) {
      element = (
        <ProgressBar percentage={percentage} showTooltip={true} />
      );
    }

    return element;
  },

  renderChoices: function() {
    var getCharacterFromIndex = function(index) {
      return String.fromCharCode(97 + index);
    };
    var answerClass;

    return _.map(this.state.question.answers, function(answer, index) {
      answerClass = this.state.selectedAnswer.id === answer.id ? 'selected' : '';
      return (
        <li key={index} className={answerClass} onClick={this.selectAnswer.bind(null, answer)}>
          <div className="choice-indicator">
            {getCharacterFromIndex(index)}
          </div>
          <span>{answer.body}</span>
        </li>
      );
    }.bind(this));
  },

  renderMultipleChoice: function() {
    return (
      <ul className="multiple-choice">
        {this.renderChoices()}
      </ul>
    );
  },

  renderShortAnswer: function() {
    return (
      <textarea />
    );
  },

  renderAnswers: function() {
    switch ( this.state.question.type ) {
      case 'short':
        return this.renderShortAnswer();
      case 'multi':
        return this.renderMultipleChoice();
    }
  },

  renderCurrentQuestion: function() {
    var element = null;
    var numQuestions = this.props.quiz.questions ? this.props.quiz.questions.length : 0;
    var isLastQuestion = this.state.currentQuestionNumber === numQuestions;
    var isSubmitDisabled = _.isEmpty(this.state.selectedAnswer);
    var buttonValue = isLastQuestion ? 'Finish Quiz' : 'Next Question';

    if ( !this.state.quizComplete && this.state.question && this.state.currentQuestionNumber > 0 ) {
      element = (
        <div className="question-container">
          <h2 className="question-body">{this.state.question.body}</h2>
          {this.renderAnswers()}
          <input type="submit"
                 className="button float-right nudge--sides nudge--bottom"
                 onClick={this.submitAnswer}
                 disabled={isSubmitDisabled ? 'true' : ''}
                 value={buttonValue} />
        </div>
      );
    }

    return element;
  },

  renderFinishedScreen: function() {
    var element = null;
    var numQuestions = this.props.quiz.questions ? this.props.quiz.questions.length : 1;

    if ( this.state.quizComplete ) {
      element = (
        <div className="intro-finish-container soft--sides">
          <div>
            <h1 className="title sans-serif flush--bottom">Quiz complete!</h1>
            <h6 className="primary serif italic weight--normal">Your score: {this.state.userScore}/{numQuestions}</h6>
          </div>
          <div>
            <Link to="CourseLesson"
                  params={{ courseId: this.props.quiz.id, lessonId: this.props.lessonId }}
                  className="button soft--sides soft-half--ends">
              Back to Lesson
            </Link>
          </div>
        </div>
      );
    }

    return element;
  },

  render: function() {
    console.log('quiz:', this.props.quiz);
    return (
      <div className="quiz">

        {this.renderIntro()}

        {this.renderProgressBar()}

        {this.renderCurrentQuestion()}

        {this.renderFinishedScreen()}

      </div>
    );
  }

});

module.exports = React.createFactory(Quiz);