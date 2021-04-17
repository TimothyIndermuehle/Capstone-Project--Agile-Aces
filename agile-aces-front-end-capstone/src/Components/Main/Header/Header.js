import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modals from '../../Modals/Modals';
import ClassDetails from './ClassDetails'
import './Header.css';
import {createTopic} from '../../../databaseActions/topicActions'
// import {users} from '../../../firebase';

class Header extends Component {
  constructor(props) {
    super();
    this.state = {
      modalVisible: false,
      targetModal: 'Default',
      view: props.view,
      student: [],
      pending: [],
      teacher: [],
      addTopic: '',
      teacherName: '',
    }
    this.toggleModals = this.toggleModals.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleModals(e) {
    e.preventDefault();
    const { modalVisible, targetModal } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      targetModal: targetModal === 'Default' ? e.target.value : 'Default',
    })
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  addTopic(e) {
    e.preventDefault();
    let title = e.target[0].value;
    var d = new Date();
    let time = d.getTime();
    if(e.target[0].value){
      createTopic(this.props.currentClassObject.id, title, time);
      this.setState({addTopic: ''})
    } else {
      alert(" topic cannot be empty ");
    }
  }

  componentDidMount() {
    const { user } = this.props;
    user.collection('student').onSnapshot(querySnapshot =>{
      let student = [];
      querySnapshot.forEach(doc => {
        student.push(doc.id)
      })
      this.setState({ student: student });
    })
    user.collection('pending').onSnapshot(querySnapshot =>{
      let pending = [];
      querySnapshot.forEach(doc => {
        pending.push(doc.id)
      })
      this.setState({ pending: pending });
    })
    user.collection('teacher').onSnapshot(querySnapshot =>{
      let teacher = [];
      querySnapshot.forEach(doc => {
        teacher.push(doc.id)
      })
      this.setState({ teacher: teacher });
    })
  }

  render() {
    const { user, teacherClassList, studentClassList } = this.props;
    if(this.props.view === "dashboard"){
      return (
      <div>
        <div id="subHeader" className="title" style={ { backgroundImage: `url(${process.env.PUBLIC_URL}/teach-me-more.jpg)`}}>
        <h1>Teach Me More</h1>
        <div className="titleHeaderButtons">
            <button className="btn btn-main createClass btn-header" id="createClass" type="button" value="CreateAClassModal" onClick={this.toggleModals}>Create a Class</button>
            <button className="btn btn-main findAClass btn-header" id="findClass" type="button" value="FindAClassModal" onClick={this.toggleModals}>Find a Class</button>
          </div>
      </div>
        <div className="mainTop">
          <div className="header">
          
          {((teacherClassList.length + studentClassList.length) > 0)?
            (<div className="classesHeader"><h2>{this.props.header}</h2><hr className="headerHr"></hr></div>)
            :
            <div></div>
          }
          <Modals user={user} toggle={this.state.modalVisible} value={this.state.targetModal} onModalClose={this.toggleModals} pending={this.state.pending} student={this.state.student} teacher={this.state.teacher}/>
        </div>
       </div>
       </div>
      )
    } else if(this.props.view === "student") {
      return (
        <div>
          <div className="title">
            <h1>{this.props.currentClassObject.title}</h1>
          </div>
          <div className="header">
            <h2 className="topicHeader">{this.props.header}</h2>
            <div id="headerClassDetails">
            <ClassDetails currentClassObject={this.props.currentClassObject} toggle={this.state.modalVisible} value={this.state.targetModal} currentClassTeacherName={this.props.currentClassTeacherName} pending={this.state.pending}/>
            </div>
          </div>
        </div>
      )
    } else if(this.props.view === "teacher") {
      return (
        <div>
          <div className="title">
            <h1>{this.props.currentClassObject.title}</h1>
          </div>
          <div className="header">
            <div id="headerClassDetails">
             <ClassDetails currentClassObject={this.props.currentClassObject} currentClassTeacherName={this.props.currentClassTeacherName} view={this.props.view} edit={this.state.edit} pendingStudents={this.props.pendingStudents} enrolledStudents={this.props.enrolledStudents}/>
            </div>
            <h2 className="topicHeader">{this.props.header}</h2>
            <div className="addTopicForm">
            <form id="addTopicForm" onSubmit={this.addTopic}>
              <input className ="addTopicInput" type="text" id="addTopic" name="addTopic" placeholder=" Type a new topic here..." value={this.state.addTopic} onChange={this.handleChange}></input>
              <button className="btn btn-main addTopicBtn" type="submit" id="topicSubmit" value="New Topic">Add Topic</button>
            </form>
            </div>
          </div>
        </div>
      )
    }else {
      return (
        <div>
          not a valid view
        </div>
      )
    }
  }
}

export default Header;

Header.propTypes = { 
  user: PropTypes.object,
  currentClassObject: PropTypes.object,
  view: PropTypes.string,
  pendingStudents: PropTypes.array,
  enrolledStudents: PropTypes.array,
  header:PropTypes.string
}
