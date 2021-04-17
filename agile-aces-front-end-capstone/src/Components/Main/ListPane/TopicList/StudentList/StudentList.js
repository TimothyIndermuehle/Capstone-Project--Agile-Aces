import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {addVoter, removeVoter} from '../../../../../databaseActions/topicActions';
import QuestionListStudent from '../StudentList/QuestionListStudent/QuestionListStudent';
import './StudentList.css';

export default class StudentList extends Component {
  constructor(props) {
    super();
    this.toggleQuestions = this.toggleQuestions.bind(this);
    this.handleCreateQuestion = this.handleCreateQuestion.bind(this);
    this.handleAddVote = this.handleAddVote.bind(this);
    this.handleRemoveVote = this.handleRemoveVote.bind(this);
  }

  toggleQuestions(e) {
    const { onToggleQuestions } = this.props;
    onToggleQuestions(e);
  }

  handleCreateQuestion(e) {
    const { createQuestion } = this.props;
    createQuestion(e);
  }

 handleAddVote(e) {
    const {dataset: {id} } = e.target;
    const {classId, userId} = this.props;

    addVoter(classId, id, userId);
  }

  handleRemoveVote(e) {
    const {dataset: {id} } = e.target;
    const {classId, userId} = this.props;

    removeVoter(classId, id, userId);
  }

  render() {
    const {topics, filteredTopicTitles, userId, classId } = this.props;

    return (
      <div>
        <p className="blank">Vote for the topics in which you would like more instruction. Have a specific question? Create it or vote for it.</p>
        <ul id="topicView">
          {filteredTopicTitles.map((theTopic) =>
            <li className="topicStudent" key={theTopic}>
            <h3>{topics[theTopic]['title'] || theTopic}</h3>
            <p>
            Total Votes <span className="vote-count">{topics[theTopic].voters.length}</span>
            </p>
            {topics[theTopic].voters.includes(userId) ? 
              <div className="checkEdit">
                <button data-id={theTopic} className="badge badge-pill add-vote" title="Remove vote from this topic" name="addVote" onClick={this.handleRemoveVote} >Remove Vote</button> 
              </div>
              : 
              <div className="checkEdit">
                <button data-id={theTopic} className="badge badge-pill add-vote" title="Vote for this topic" name="addVote" onClick={this.handleAddVote} >Add Vote</button>
              </div>
            }
            <div className="question-buttons">
            <div className="view-create-buttonsOne">
              <button className="btn btn-main create-question" onClick={this.toggleQuestions} data-topic={theTopic}>View Question List</button>
            </div> 
            <div className="view-create-buttonsTwo">
              <button data-topic={theTopic} className="btn btn-main create-question" value="CreateAQuestionModal" onClick={this.handleCreateQuestion}>Create Question</button>
            </div>
            </div>
            <QuestionListStudent classId={classId} userId={userId} topics={topics} topic={theTopic} />
          </li>
          )}
        </ul>
      </div>
    )
  }
}

StudentList.propTypes = {
  classId: PropTypes.string,
  userId: PropTypes.string,
  onToggleQuestions: PropTypes.func,
  createQuestion: PropTypes.func,
  filteredTopicTitles: PropTypes.array,
  topics: PropTypes.object

}
