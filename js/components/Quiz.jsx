'use strict';

var React       = require('react/addons');
var _           = require('lodash');
var Link        = require('react-router').Link;

var QuizActions = require('../actions/QuizActions');
var ProgressBar = require('./ProgressBar.jsx');

var Quiz = React.createClass({

  propTypes: {
    lessonId: React.PropTypes.number.isRequired,
    lessonTitle: React.PropTypes.string.isRequired,
    quiz: React.PropTypes.object.isRequired,
    flagQuizComplete: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      lessonTitle: '',
      quiz: {},
      flagQuizComplete: function() {}
    };
  },

  getInitialState: function() {
    return {
      question: null,
      userScore: 0,
      currentQuestionNumber: 0,
      quizComplete: false,
      selectedAnswer: {},
      loading: false,
      error: null
    };
  },

  _onQuestionChange: function(err, question) {
    if ( err ) {
      this.setState({ error: err.message, loading: false });
    } else if ( question ) {
      this.setState({
        error: null,
        loading: false,
        question: question,
        currentQuestionNumber: this.state.currentQuestionNumber + 1,
        selectedAnswer: {}
      });
    }
  },

  _onAnswerCheck: function(err, result) {
    if ( err ) {
      this.setState({ error: err.message, loading: false });
    } else {
      this.setState({
        loading: false,
        userScore: result.score
      }, this.getNextQuestion);
    }
  },

  componentDidUpdate: function(prevProps) {
    if ( !_.isEmpty(this.props.quiz) && this.props.quiz.id !== prevProps.quiz.id ) {
      this.setState(this.getInitialState());
    }
  },

  beginQuiz: function(evt) {
    evt.preventDefault();
    this.props.beginQuiz(this.getNextQuestion);
  },

  selectAnswer: function(answer) {
    this.setState({ selectedAnswer: answer.body });
  },

  submitAnswer: function() {
    this.setState({ loading: true });
    QuizActions.checkAnswer(this.state.question.id, this.state.selectedAnswer, this._onAnswerCheck);
  },

  getNextQuestion: function() {console.log('get next question');

    this.setState({ loading: true });

    if ( this.state.currentQuestionNumber < this.props.quiz.numQuestions ) {
      QuizActions.getQuestion(this.props.quiz.id, this._onQuestionChange);
    } else {
      this.setState({
        loading: false,
        currentQuestionNumber: this.state.currentQuestionNumber + 1,
        quizComplete: true
      }, this.props.flagQuizComplete);
    }
  },

  renderIntro: function() {
    var element = null;
    var pluralized = (this.props.quiz.numQuestions === 0 || this.props.quiz.numQuestions > 1) ? 'questions' : 'question';

    if ( this.state.currentQuestionNumber === 0 ) {
      element = (
        <div className="intro-finish-container soft--sides">
          <div>
            <h1 className="title sans-serif flush--bottom">{this.props.quiz.lessonTitle}</h1>
            <h6 className="primary serif italic weight--normal">{this.props.quiz.numQuestions} {pluralized}</h6>
          </div>
          <div>
            <a className="button soft--sides soft-half--ends" onClick={this.beginQuiz}>Begin Quiz</a>
          </div>
        </div>
      );
    }

    return element;
  },

  renderProgressBar: function() {
    var element = null;
    var percentage = ((this.state.currentQuestionNumber-1)/this.props.quiz.numQuestions)*100;

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
      answerClass = this.state.selectedAnswer === answer.body ? 'selected' : '';
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
    var isLastQuestion = this.state.currentQuestionNumber === this.props.quiz.numQuestions;
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

    if ( this.state.quizComplete ) {
      element = (
        <div className="intro-finish-container soft--sides">
          <div>
            <h1 className="title sans-serif flush--bottom">Quiz complete!</h1>
            <h6 className="primary serif italic weight--normal">Your score: {this.state.userScore}%</h6>
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

module.exports = Quiz;