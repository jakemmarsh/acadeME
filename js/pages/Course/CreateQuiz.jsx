'use strict';

var React      = require('react/addons');
var when       = require('when');
var _          = require('lodash');
var Navigation = require('react-router').Navigation;
var Link       = require('react-router').Link;

var CourseAPI  = require('../../utils/CourseAPI');
var QuizAPI    = require('../../utils/QuizAPI');
var TagInput   = require('../../components/TagInput.jsx');

var CreateLesson = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    course: React.PropTypes.object.isRequired,
    lesson: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      course: {}
    };
  },

  getInitialState: function() {
    return {
      numQuestions: '0',
      tags: [],
      suggestedQuestions: [],
      questions: [],
      questionBody: '',
      questionDifficulty: 5,
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      correctAnswer: 'a',
      loading: false,
      error: null,
      userHasEnteredTags: false,
      userHasViewedSuggestions: false,
      quizCreated: false
    };
  },

  _saveQuiz: function() {
    var deferred = when.defer();
    var quiz = {
      numQuestions: parseInt(this.state.numQuestions) || 0,
      tags: this.state.tags
    };

    CourseAPI.createQuiz(quiz, this.props.params.courseId, this.props.params.lessonId).then(function(createdQuiz) {
      deferred.resolve(createdQuiz);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  },

  _saveQuestionsWithAnswers: function(quiz) {
    var mainDeferred = when.defer();
    var questionPromises = [];
    var currentAnswers;

    var saveAnswers = function(question) {
      var answer = when.defer();
      var answers = _.map(currentAnswers, function(answer) {
        return {
          body: answer.body,
          isCorrect: answer.isCorrect
        };
      });

      QuizAPI.saveAnswers(quiz.id, question.id, answers)
      .then(answer.resolve)
      .catch(answer.reject);

      return answer.promise;
    };

    var saveQuestion = function(question) {
      var deferred = when.defer();

      QuizAPI.saveQuestion(quiz.id, question)
      .then(saveAnswers)
      .then(deferred.resolve)
      .catch(deferred.reject);

      return deferred.promise;
    };

    _.each(this.state.questions, function(question) {
      currentAnswers = question.answers;
      questionPromises.push(saveQuestion(question));
    });

    when.all(questionPromises).then(function() {
      mainDeferred.resolve();
    }).catch(function(err) {
      mainDeferred.reject(err);
    });

    return mainDeferred.promise;
  },

  addTag: function(tag) {
    this.setState({ tags: _.union(this.state.tags, [tag]) });
  },

  removeTag: function(tag) {
    this.setState({ tags: _.without(this.state.tags, tag) });
  },

  setCorrectAnswer: function(letter) {
    this.setState({ correctAnswer: letter });
  },

  handleStartSubmit: function(evt) {
    if ( evt ) {
      evt.preventDefault();
    }

    this.setState({ loading: true, error: null });

    QuizAPI.getQuestionSuggestions(this.state.tags).then(function(suggestions) {
      this.setState({ loading: false, userHasEnteredTags: true, suggestedQuestions: suggestions });
    }.bind(this)).catch(function(err) {
      this.setState({ loading: false, error: err.message });
    }.bind(this));
  },

  acceptSuggestion: function(question) {
    var questionsCopy = this.state.questions;
    var isAlreadyAccepted = _.some(this.state.questions, function(existingQuestion) {
      return existingQuestion.id === question.id;
    });

    if ( isAlreadyAccepted ) {
      questionsCopy = _.reject(this.state.questions, function(existingQuestion) {
        return existingQuestion.id === question.id;
      });
    } else {
      questionsCopy.push(question);
    }

    this.setState({ questions: questionsCopy });
  },

  handleQuestionSubmit: function(evt) {
    var questionsCopy = this.state.questions;
    var question = {
      body: this.state.questionBody,
      type: 'multi',
      difficulty: this.state.questionDifficulty,
      answers: []
    };
    var answers = [
      {
        body: this.state.answerA,
        isCorrect: this.state.correctAnswer === 'a'
      },
      {
        body: this.state.answerB,
        isCorrect: this.state.correctAnswer === 'b'
      },
      {
        body: this.state.answerC,
        isCorrect: this.state.correctAnswer === 'c'
      },
      {
        body: this.state.answerD,
        isCorrect: this.state.correctAnswer === 'd'
      }
    ];

    if ( evt ) {
      evt.preventDefault();
    }

    _.each(answers, function(answer) {
      if ( answer && answer.length ) {
        question.answers.push(answer);
      }
    });

    questionsCopy.push(question);

    this.setState({
      questionBody: '',
      questionDifficulty: 5,
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      questions: questionsCopy
    });
  },

  handleGlobalSubmit: function(evt) {
    if ( evt ) {
      evt.preventDefault();
    }

    this.setState({ loading: true, error: null });

    this._saveQuiz().then(this._saveQuestionsWithAnswers).then(function() {
      this.setState({ loading: false, quizCreated: true });
    }.bind(this)).catch(function(err) {
      this.setState({ loading: false, error: err.message });
    }.bind(this));
  },

  renderStartForm: function() {
    var isSubmitDisabled = !this.state.tags || !this.state.tags.length;

    return (
      <form className="start-container" onSubmit={this.handleStartSubmit}>
        <div>

          <p>Enter up to five (5) tags that are relevant to the topic of the quiz you are about to create.</p>

          <TagInput ref="tagInput"
                    addTag={this.addTag}
                    removeTag={this.removeTag}
                    placeholder="Playlist tags" />

          <input type="number"
                 min="1"
                 className="large-input nudge-half--ends"
                 valueLink={this.linkState('numQuestions')}
                 placeholder="How many questions will this quiz be?" />

          <button className="btn float-right nudge-half--top"
                  type="submit"
                  disabled={isSubmitDisabled ? 'true' : ''}>
            Next Step
          </button>

        </div>
      </form>
    );
  },

  renderSuggestions: function() {
    var characters = ['A', 'B', 'C', 'D'];
    var renderAnswers = function(answers) {
      return _.map(answers, function(answer, index) {
        return (
          <li key={index}>
            <span><strong>{characters[index]}.</strong> {answer.body}</span>
          </li>
        );
      });
    };
    var renderQuestions = function() {
      var isSelected = false;
      var outerClasses;
      var iconClasses;

      return _.map(this.state.suggestedQuestions, function(question, index) {
        isSelected = _.some(this.state.questions, function(suggestion) { return suggestion.id === question.id; });

        outerClasses = isSelected ? 'selected' : '';
        iconClasses = 'fa ' + (isSelected ? 'fa-check' : 'hidden');

        return (
          <li className={outerClasses} key={index} onClick={this.acceptSuggestion.bind(this, question)}>
            <div className="check-container soft-half--sides">
              <div className="check-circle">
                <i className={iconClasses} />
              </div>
            </div>
            <div className="soft-half--left">
              <h4>{question.body}</h4>
              <ul className="answer-list soft--left">
                {renderAnswers(question.answers)}
              </ul>
            </div>
          </li>
        );
      }.bind(this));
    }.bind(this);
    var markSuggestionsAsViewed = function() {
      this.setState({ userHasViewedSuggestions: true });
    }.bind(this);

    return (
      <div>
        <p>Below are a list of questions suggested for your quiz based on the tags that you specified in the previous step. If you would like to use any of these questions in your quiz, simply check the circle to the left of any question.</p>

        <ul className="question-list">
          {renderQuestions()}
        </ul>

        <button className="btn float-right nudge-half--bottom" onClick={markSuggestionsAsViewed}>Next Step</button>
      </div>
    );
  },

  renderQuestionForm: function() {
    var hasQuestionBody = this.state.questionBody && this.state.questionBody.length;
    var answers = [this.state.answerA, this.state.answerB, this.state.answerC, this.state.answerD];
    var numAnswers = _.filter(answers, function(answer) {
      return answer && answer.length;
    }).length;
    console.log(numAnswers, this.state.answerA, this.state.answerB, this.state.answerC, this.state.answerD);
    var hasMultipleAnswers = numAnswers > 1;
    var isSubmitDisabled = !hasQuestionBody || !hasMultipleAnswers;
    var renderAnswerInputs = function() {
      var letters = ['a', 'b', 'c', 'd'];
      var valueLink;

      return _.map(letters, function(letter) {
        valueLink = 'answer' + letter.toUpperCase();

        return (
          <li>
            <div className="choice-indicator">
              {letter.toUpperCase()}
            </div>
            <input type="text"
                   className="nudge-half--left"
                   valueLink={this.linkState(valueLink)}
                   placeholder="Possible answer..." />
            <div>
              <input type="checkbox"
                     checked={this.state.correctAnswer === letter}
                     onChange={this.setCorrectAnswer.bind(this, letter)} />
            </div>
          </li>
        );
      }.bind(this));
    }.bind(this);

    return (
      <form className="question-form" onSubmit={this.handleQuestionSubmit}>

        <input type="text"
               className="large-input nudge-half--ends"
               valueLink={this.linkState('questionBody')}
               placeholder="Question..." />

        <input type="range"
               className="large-input nudge-half--ends"
               min="0"
               max="10"
               step="1"
               valueLink={this.linkState('questionDifficulty')}
               placeholder="How difficult is this question, on a scale of 1-10?" />

        <ul className="multiple-choice nudge-half--top nudge--bottom">
          {renderAnswerInputs()}
        </ul>

        <input type="submit"
                 className="btn float-right nudge-half--bottom"
                 disabled={isSubmitDisabled ? 'true' : ''}
                 value="Save Question" />

      </form>
    );
  },

  renderGlobalSubmitButton: function() {
    var element = null;
    var hasQuestions = this.state.questions && this.state.questions.length;
    var isDisabled = !hasQuestions;

    if ( !this.state.quizCreated && this.state.userHasEnteredTags ) {
      element = (
        <button className="btn highlight nudge-half--bottom"
                onClick={this.handleGlobalSubmit}
                disabled={isDisabled ? 'true' : ''}>Create Quiz</button>
      );
    }

    return element;
  },

  renderSuccessMessage: function() {
    return (
      <div className="nudge-half--top">
        <h3 className="text-center nudge-half--bottom">Quiz successfully created!</h3>
        <Link to="Course" params={{ courseId: this.props.params.courseId }} className="btn">Back to Course</Link>
      </div>
    );
  },

  render: function() {
    var renderFunction = function() {};

    if ( !this.state.userHasEnteredTags ) {
      renderFunction = this.renderStartForm;
    } else if ( this.state.quizCreated ) {
      renderFunction = this.renderSuccessMessage;
    } else if ( this.state.suggestedQuestions.length && !this.state.userHasViewedSuggestions ) {
      renderFunction = this.renderSuggestions;
    } else if ( !this.state.suggestedQuestions.length || this.state.userHasViewedSuggestions ) {
      renderFunction = this.renderQuestionForm;
    }

    return (
      <section className="create-quiz nudge">

        <h2 className="page-title flush--bottom">Create a Quiz</h2>

        {renderFunction()}

        {this.renderGlobalSubmitButton()}

      </section>
    );
  }

});

module.exports = CreateLesson;