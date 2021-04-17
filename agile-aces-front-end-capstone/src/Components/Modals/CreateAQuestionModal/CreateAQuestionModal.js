import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateAQuestionModal.css';
import { createQuestion } from '../../../databaseActions/questionActions'

class CreateAQuestionModal extends Component {
  constructor(props) {
    super(props);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      question: ''
    }
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => {
      if(this.state.question.length === 240){
        alert('Please limit your question to 240 characters')
      }
    })
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { question } = this.state;
    const { topic, currentClassObject: { id: classId }, user: { id: author } } = this.props;

    var d = new Date();
    let time = d.getTime();

    createQuestion(classId, topic, question, time, author);
    this.handleModalClose(e)
  }

  render() {
    const { question } = this.state
  
    return (
      <div className="modal-wrapper">
        <main id="createAQuestionModal" className="our-modal">
          <span className="close" onClick={this.handleModalClose}>&times;</span>
          <h1>Create a Question</h1>
          <form className="Question" onSubmit={this.handleSubmit}>
            <textarea id="textArea" placeholder="Enter Question Here" maxLength="240" name="question" value={question} onChange={this.handleChange}></textarea>
            <button type="submit" className="btn">Submit</button>
            <button className="btn btn-main " onClick={this.handleModalClose}>Cancel</button>
          </form>
        </main>
      </div>
    )
  }
} 

export default CreateAQuestionModal;

CreateAQuestionModal.propTypes = {
  onModalClose: PropTypes.func,
  topic: PropTypes.string,
  user: PropTypes.object,
  currentClassObject: PropTypes.object
}
