import React, { Component } from 'react';
import { deleteTopic, updateTopic } from '../../../../../databaseActions/topicActions';
import PropTypes from 'prop-types';
import './TeacherList.css';

export default class TeacherList extends Component {
  constructor() {
    super();
    this.toggleQuestions = this.toggleQuestions.bind(this);
    this.createQuestionListTeacher = this.createQuestionListTeacher.bind(this);
    this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
    this.editTopic = this.editTopic.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
  }

  toggleQuestions(e) {
    const { onToggleQuestions } = this.props;
    onToggleQuestions(e);
  }

  handleDeleteTopic(e) {
    const {classId } = this.props;
    const topicId = e.target.getAttribute("data-id");

    deleteTopic(classId, topicId);
  }

  editTopic(e) {
    const { topics } = this.props;
    const { dataset: { id } } = e.target;
    const topic = document.getElementById(id);
    topics[id].onEdit = true;
    topic.tabIndex = 6;
    topic.focus();
    topic.click();
    this.setState({topics});
  }

  submitChanges(e) {
    e.preventDefault();
    const { topics, classId } = this.props;
    const { dataset: { id } } = e.target;
    const topic = document.getElementById(id);
    const title = topic.innerText;

    topics[id].onEdit = false;
    topic.tabIndex = -1;

    updateTopic(classId, id, {title})

    this.setState({ topics });
  }

  createQuestionListTeacher(topic) {
    const {topics} = this.props;

    if(topic){
      return (
        <div className="questionList">
          {(topics[topic].questions[0] === 'no questions') ?
            <p className="blank"> No questions submitted.</p>
            :
            <ul>
              {topics[topic].questions.map((question) =>
                <li className="questionListItem" key={question.id}>
                  <p className="questionVoteParagraph">
                    Total Votes <span className="vote-count" >{question.voters.length}</span>
                  </p>
                  <p className="questionQuestion">
                    {question.question}
                  </p>
                </li>
              )}
            </ul>
          }
        </div>  
      )
    }
  }

  render() {
    const { topics, filteredTopicTitles } = this.props;

    return (
      <ul id="topicView">
        {filteredTopicTitles.map((theTopic) =>    
          <li className="topic" key={theTopic}>
            {topics[theTopic]['title'] && topics[theTopic].onEdit ?
              <h3 id={theTopic} suppressContentEditableWarning="true" contentEditable="true">
                {topics[theTopic]['title'] || theTopic}
              </h3>
              :
              <h3 id={theTopic} suppressContentEditableWarning="true" contentEditable="false">
                {topics[theTopic]['title'] || theTopic}
              </h3>
            }
            <p>
              Total Votes <span className="vote-count">{topics[theTopic].voters.length}</span>
            </p>
            <div className="topicButtons">
            {topics[theTopic].onEdit ?
              <div className="checkEdit">
                <button className="badge badge-pill add-vote" name="deleteTopic" data-id={theTopic} onClick={this.submitChanges}>Submit Changes</button>
              </div>
              :
              <div className="checkEdit">
                <button className="badge badge-pill add-vote" name="deleteTopic" data-id={theTopic} onClick={this.editTopic}>Edit Topic</button>
              </div>
            }
            <div className="checkAdd">
              <button className="badge badge-pill add-vote" name="deleteTopic" data-id={theTopic} onClick={this.handleDeleteTopic}>Delete</button>
            </div>
            </div>
            <div className="view-create-buttons">
              <button className="btn btn-main questionListButton" onClick={this.toggleQuestions} data-topic={theTopic} >View Question List</button>
            </div>
            {this.createQuestionListTeacher(theTopic)}
          </li>
        )}
      </ul>
    )
  }
}

TeacherList.propTypes = {
  classId: PropTypes.string,
  onToggleQuestions: PropTypes.func,
  filteredTopicTitles: PropTypes.array,
  topics: PropTypes.object

}
