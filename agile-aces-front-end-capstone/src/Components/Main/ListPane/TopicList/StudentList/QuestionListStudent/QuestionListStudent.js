import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { updateQuestion, addQuestionVoter, deleteQuestionVoter} from '../../../../../../databaseActions/questionActions';

export default class QuestionListStudent extends Component {
  constructor() {
    super();
    this.handleAddQuestionVote = this.handleAddQuestionVote.bind(this);
    this.handleDeleteQuestionVoter = this.handleDeleteQuestionVoter.bind(this);
    this.editQuestion = this.editQuestion.bind(this);
    this.createEditQuestion = this.createEditQuestion.bind(this);
    this.submitEditQuestion = this.submitEditQuestion.bind(this);
  }

  handleAddQuestionVote(e){
    const {userId, classId} = this.props;
    const {dataset: {id, topic}} = e.target;
    
    addQuestionVoter(classId, topic, id, userId);
  }

  handleDeleteQuestionVoter(e){
    const {userId, classId} = this.props;
    const {dataset: {id, topic}} = e.target;
    
    deleteQuestionVoter(classId, topic, id, userId);
  }

  createEditQuestion(question, topic) {
    const { id, onEdit } = question;

    return (
      (onEdit) ?
        <button data-id={id} data-topic={topic} name="addVote" onClick={this.submitEditQuestion} className="editQuestion badge badge-pill add-vote">Submit Changes</button>
        :
        <button data-id={id} data-topic={topic} name="addVote" onClick={this.editQuestion} className="editQuestion badge badge-pill add-vote">Edit Question</button>
    )
  }

  editQuestion(e) {
    e.preventDefault();
    const {dataset: {topic, id }} = e.target;
    const { topics } = this.props;
    const renderQuestion = document.getElementById(id);
    const [question] = topics[topic].questions
      .filter(question => question.id === id);
    
    question.onEdit = true;
    renderQuestion.tabIndex = 6;
    renderQuestion.focus();
    renderQuestion.click();

    this.setState({ topics });
        
  }

  submitEditQuestion(e) {
    const {dataset: {topic, id }} = e.target;
    const { topics, classId } = this.props;
    const renderQuestion = document.getElementById(id);
    const {innerText: newQuestion} = renderQuestion;
    const [question] = topics[topic].questions
      .filter(question => question.id === id);
  
    updateQuestion(classId, topic, id, {'question': newQuestion});
    question.onEdit = false;
    renderQuestion.tabIndex = -1
    renderQuestion.focus();
    renderQuestion.click();

    this.setState({ topics });
  }

  render() {
    const { topic, topics, userId} = this.props;
    const editWindow = new Date();
    return (
      <div className="questionList">
        <ul>
          {(topics[topic].questions[0] === 'no questions') ?
          <p className="blank">
            Feeling unsure? Ask your question!
          </p>
          :
          topics[topic].questions.map((question) =>
            {
              return <li className="questionListItem" key={question.id}>
                <p className="questionVoteParagraph">
                  Total Votes <span className="vote-count">{question.voters.length}</span>
                </p>
                {question.voters.includes(userId) ?
                  <button data-id={question.id} data-topic={topic} name="addVote" title="Vote for this question" onClick={this.handleDeleteQuestionVoter} className="voteQuestion badge badge-pill add-vote">Remove Vote</button>
                  :
                  <button data-id={question.id} data-topic={topic} name="addVote" title="Remove your vote for this question" onClick={this.handleAddQuestionVote} className="voteQuestion badge badge-pill add-vote">Add Vote</button>}
                {(editWindow.getTime() - question.time) / 1000 < 900 && question.author === userId ?
                  this.createEditQuestion(question, topic)
                  :
                  <p></p>}
                {question.onEdit ?
                  <p id={question.id} contentEditable="true" suppressContentEditableWarning="true" className="questionQuestion">{question.question}
                  </p>
                  :
                  <p id={question.id} className="questionQuestion">
                    {question.question}
                  </p>}
              </li>;
            }
          )}
        </ul>
      </div>
    )
  }
}

QuestionListStudent.propTypes = {
  classId: PropTypes.string,
  userId: PropTypes.string,
  topics: PropTypes.object,
  topic: PropTypes.string
}
