import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ListPane.css';
import ClassList from '../ClassList';
import TopicList from './TopicList/TopicList';

class ListPane extends Component {

  render() {       
    const {topics, user, currentClassObject, view, classes, onClickOnClass, onToggleQuestions, searchRegex, getAllUserClassesSubs } = this.props;

    if(view === "dashboard"){
      return (
      <div className="listPane">
        <ClassList user={user} getAllUserClassesSubs={getAllUserClassesSubs} classes={classes} onClickOnClass={onClickOnClass} listClass={"dashboardList"} searchRegex={searchRegex} teacherClassList = {this.props.teacherClassList} studentClassList = {this.props.studentClassList}/>
      </div>
      )
    } else if(view === "student" || view === "teacher"){
      return (
      <div className="listPane">
        <TopicList view={view} user={user} onToggleQuestions={onToggleQuestions} currentClassObject={currentClassObject} topics={topics} searchRegex={searchRegex}/>
      </div>
      )
    }
    else {
      return (
        <div className="listPane">
           not a valid view
        </div>
        )
      }
    }
}

export default ListPane;

ListPane.propTypes = {
  teacherClassList: PropTypes.array,
  studentClassList: PropTypes.array,
  searchRegex:PropTypes.object,
  topics: PropTypes.object,
  currentClassObject: PropTypes.object,
  view: PropTypes.string,
  user: PropTypes.object,
  classes: PropTypes.array,
  onClickOnClass: PropTypes.func,
  onToggle: PropTypes.func
}
