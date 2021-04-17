import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modals from '../../../Modals/Modals';
import TeacherList from './TeacherList/TeacherList';
import StudentList from './StudentList/StudentList';

class TopicList extends Component {

  constructor(props) {
    super()
    this.state = {
      modalVisible: false,
      targetModal: 'Default',
      selectedTopic: null,
    }
    this.toggleModals = this.toggleModals.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    
  }

  toggleModals(e) {
    e.preventDefault();
    const { modalVisible, targetModal } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      targetModal: targetModal === 'Default' ? e.target.value : 'Default',
      selectedTopic: e.target.getAttribute('data-topic')
    })
  }

  createQuestion(e) {
    e.preventDefault();
    this.toggleModals(e);
  }  

  render() {

    const { view, topics, user, user: {id: userId}, currentClassObject, currentClassObject: { id: classId }, searchRegex, onToggleQuestions } = this.props;
    const { modalVisible, targetModal } = this.state;
    const filteredTopicTitles = Object.keys(topics).filter(key => {
      return searchRegex ? searchRegex.test(topics[key].title) : true;
    } );

    if(view === "student") {
      return (
        <div>
          { (Object.getOwnPropertyNames(topics).length > 0) ?
          <StudentList classId={classId} userId={userId} filteredTopicTitles={filteredTopicTitles } onToggleQuestions={onToggleQuestions} createQuestion={this.createQuestion} topics={topics} />
        :
        <p className="blank"> Check back soon to vote on topics</p>
        }
      <Modals user={user} toggle={modalVisible} value={targetModal} onModalClose={this.toggleModals} topic={this.state.selectedTopic} currentClassObject={currentClassObject} />
    </div>
    )
    } else if(view === "teacher"){
      return (
        <div>
       { (Object.getOwnPropertyNames(topics).length > 0) ? 
        <TeacherList classId={classId} onToggleQuestions={onToggleQuestions} filteredTopicTitles={filteredTopicTitles} topics={topics} />
        :
        <div className="blank">
        <p>You have not created any topics yet. </p>
        </div>
        }
    </div>
      )
    } else {
      return (
        <div>
          not a valid view
        </div>
      )
    }
  }
} 

export default TopicList;

TopicList.propTypes = {
  currentClassObject: PropTypes.object,
  onToggleQuestions: PropTypes.func,
  user: PropTypes.object,
  topics: PropTypes.object
}
