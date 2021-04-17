import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Main.css';
import './SideBar.css';
import './SearchBar.css';
import ClassList from './ClassList';
import Header from './Header/Header';
import Navbar from './NavBar/NavBar';
import ListPane from './ListPane/ListPane';
import {getOneClass, getEnrolledStudents, getPendingStudents} from '../../databaseActions/classActions';
import { getAllTopics } from '../../databaseActions/topicActions';
import {getTopicQuestions} from '../../databaseActions/questionActions'
import { getAllUserClasses } from '../../databaseActions/classActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Main extends Component {
  constructor(props) {
    super()
    this.state = {
      view: "dashboard",
      header: "Classes",
      topics: {},
      getOneClassSubs: [],
      getAllTopicsSubs: [],
      getPendingStudentsSubs: {},
      getEnrolledStudentsSubs: {},
      getAllUserClassesSubs: {},
      getTopicQuestionsSubs: {},
      classes: [],
      currentClassObject: null,
      currentClassTeacherName: "",
      pendingStudents: [],
      enrolledStudents: [],
      teacherClassList: [],
      studentClassList: [],
      value: '',
      searchRegex: /.*\w*./,
      classListOpen: false,
    }
    this.logout = this.logout.bind(this);
    this.clickOnClass = this.clickOnClass.bind(this);
    this.getOneClass = getOneClass.bind(this);
    this.getEnrolledStudents = getEnrolledStudents.bind(this);
    this.getPendingStudents = getPendingStudents.bind(this);
    this.dashboardClick = this.dashboardClick.bind(this);
    this.getAllTopics = getAllTopics.bind(this);
    this.toggleQuestions = this.toggleQuestions.bind(this);
    this.getTopicQuestions = getTopicQuestions.bind(this);
    this.handleChange =this.handleChange.bind(this);
    this.toggleClassList = this.toggleClassList.bind(this);
    this.getAllUserClasses = getAllUserClasses.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  unsubscribe() {
    const { getTopicQuestionsSubs, getOneClassSubs, getAllTopicsSubs, getPendingStudentsSubs, getEnrolledStudentsSubs } = this.state;

    const getSubs = [getOneClassSubs, getAllTopicsSubs];

    getSubs.forEach(subType => subType.forEach(sub => sub && sub()));

    Object.keys(getTopicQuestionsSubs).forEach(topic => {
      getTopicQuestionsSubs[topic].forEach(sub => sub && sub());
    });

    Object.keys(getPendingStudentsSubs).forEach(student => {
      // getPendingStudentsSubs[student].forEach(sub => sub && sub());
      if(getPendingStudentsSubs[student]){
        getPendingStudentsSubs[student]();
      }
    });

    Object.keys(getEnrolledStudentsSubs).forEach(student => {
      // getEnrolledStudentsSubs[student].forEach(sub => sub && sub());
      if(getEnrolledStudentsSubs[student]){
        getEnrolledStudentsSubs[student]()
      }
    });
  }

  clickOnClass(e) {
    this.unsubscribe();

    this.setState({
      value: '',
      searchRegex: /.*\w*./,
      classListOpen: false,
      getAllTopicsSubs: this.getAllTopics(e.id),
      getOneClassSubs: this.getOneClass(e),
      getPendingStudentsSubs: this.getPendingStudents(e),
      getEnrolledStudentsSubs: this.getEnrolledStudents(e),
      getTopicQuestionsSubs: {}
    })
  }

  dashboardClick() {
    this.unsubscribe();

    this.setState({
      getTopicQuestionsSubs: {},
      view: "dashboard",
      header: "Classes",
      topics: {},
      pendingStudents: [],
      value: '',
      searchRegex: /.*\w*./,
      enrolledStudents: [],
    });
  }

  handleChange(e) {
    const { value } = e.target;
    const searchRegex = new RegExp(`.*${value}.*`, "i")
    this.setState({value, searchRegex});
  }

  handleOnKeyDown(e) {
    const { keyCode } = e;

    if (keyCode !== 13) return false;
    
    e.preventDefault();
  }

  toggleClassList() {
    const { classListOpen } = this.state;
    this.setState({
      classListOpen: !classListOpen
    })
  }

  logout(e) {
    const { onLogout } = this.props;
    onLogout(e);
  }

  componentDidMount() {
    const { user: {id} } = this.props;
    let getAllUserClassesSubs = this.getAllUserClasses(id);
    this.setState({getAllUserClassesSubs});
  }

  toggleQuestions(e) {
    const text = e.target.innerText.slice(0, 5).trim();
    const topic = e.target.getAttribute('data-topic');
    const { topics, currentClassObject: { id } } = this.state;

    if (text === "View") {
      e.target.innerText = 'Close Question List';
      let { getTopicQuestionsSubs } = this.state;
      getTopicQuestionsSubs[topic] = this.getTopicQuestions(id, topic);
      
    } else {
      e.target.innerText = 'View Question List';
      topics[topic].questions = [];
      this.setState({ topics });
    }    
  }

  render() {
    const { view, edit, classListOpen, topics, header, value, searchRegex, currentClassObject, currentClassTeacherName, pendingStudents, enrolledStudents, classes, studentClassList, teacherClassList, getAllUserClassesSubs} = this.state;
    const { user, name, pendingOld } = this.props;

    let renderSearchBar = (Object.getOwnPropertyNames(topics).length > 0 && view !== "dashboard") || ((studentClassList.length + teacherClassList.length) > 0 && view === "dashboard");
    return (
      <div className="Main">
        <input id="slideSidebar" type="checkbox" role="button" onChange={() => classListOpen} checked={classListOpen} />
        <label htmlFor="slideSidebar" id="sideBarLabel" onClick={this.toggleClassList}><span>Open Class List</span></label>
        <section className="sidebar">
          <label htmlFor="slideSidebar" className="closeSideBar" onClick={this.toggleClassList}>&times;</label>
          <h2>My Classes</h2>
            <ClassList user={user} classes={classes} onClickOnClass={this.clickOnClass} listClass={"sidebarList"} teacherClassList={teacherClassList} studentClassList={studentClassList} />
        </section>
        <div className="main-wrap">
          <Navbar view={view} name={name} onLogout={this.logout} onClick={this.dashboardClick} toggleClassList={this.toggleClassList} classListOpen={classListOpen}/>
          <Header user={user} studentClassList={studentClassList} teacherClassList={teacherClassList} view={view} header={header} edit={edit} currentClassObject={currentClassObject} currentClassTeacherName={currentClassTeacherName} pendingOld={pendingOld} pendingStudents={pendingStudents} enrolledStudents={enrolledStudents}/>
          {renderSearchBar?
          <div className="main-search">
            <form id="mainSearch" className="form-inline">
            <FontAwesomeIcon icon="search" className="searchIcon"/>
            <input type="text" id="search" value={value} onChange={this.handleChange} name="search" placeholder={view === "dashboard" ? "Start typing to search your classes": "Start typing to search your topics"} onKeyDown={this.handleOnKeyDown}/>
            </form>
          </div>
          :
          <div></div>
          }
          <ListPane getAllUserClassesSubs={getAllUserClassesSubs} user={user} view={view} topics={topics} classes={classes} onClickOnClass={this.clickOnClass} onToggleQuestions={this.toggleQuestions} currentClassObject={currentClassObject} searchRegex={searchRegex} teacherClassList = {teacherClassList} studentClassList = {studentClassList}/>
        </div>
      </div>
    );
  }
}

export default Main;


Main.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  name: PropTypes.string,
}
