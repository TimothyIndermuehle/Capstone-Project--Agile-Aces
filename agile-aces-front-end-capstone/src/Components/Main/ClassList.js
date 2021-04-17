import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAllUserClasses, deleteClass, deleteStudent } from '../../databaseActions/classActions';
// import './SideBar/SideBar.css';
// import './DashboardClassList.css';
import './classList.css';

class ClassList extends Component {
  constructor(props) {
    super();
    this.state = {
      teacherClassList: [],
      studentClassList: []
    }
    this.clickOnClassDashboard = this.clickOnClassDashboard.bind(this);
    this.clickOnClassSidebar = this.clickOnClassSidebar.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.displayDays = this.displayDays.bind(this);
    this.displayTimes = this.displayTimes.bind(this);
    this.deleteClassOuter = this.deleteClassOuter.bind(this);
    this.deleteStudentOuter = this.deleteStudentOuter.bind(this);
    this.getAllUserClasses = getAllUserClasses.bind(this);
    this.deleteClass = deleteClass.bind(this);
    this.deleteStudent = deleteStudent.bind(this);
    this.alertIcon = this.alertIcon.bind(this);
  }

  clickOnClassSidebar = (e) =>{
    const { onClickOnClass } = this.props;
    onClickOnClass({
      role: e.target.className,
      id: e.target.dataset.key,
      title: e.target.textContent,
    });
  }

  clickOnClassDashboard(e) {
    if(e.target.id !== "deleteClassButton" && e.target.id !== "deleteStudentButton") {
      const { onClickOnClass } = this.props;
      if(e.target.parentElement.dataset.key) {
        onClickOnClass({
          role: e.target.parentElement.className,
          id: e.target.parentElement.dataset.key,
          title: e.target.parentElement.textContent,
        });
      }
    }
  }

  deleteStudentOuter(e) {
    e.preventDefault();
    const {user: {id: studentId}} = this.props;
    const classId = e.target.parentElement.dataset.key;
    if(e.target.parentElement.dataset.key) {
      if(this.props.getAllUserClassesSubs[classId]){
        this.props.getAllUserClassesSubs[classId]();
      }
      this.deleteStudent(studentId, classId);
    }
  }

  deleteClassOuter(e) {
    e.preventDefault();
    const {user: {id: teacherId}} = this.props;
    const classId = e.target.parentElement.dataset.key;
    if(e.target.parentElement.dataset.key) {
      this.deleteClass(classId, teacherId);
    }
  }

  displayTimes = (times) =>{
    let timesString = "";
    if(times['timeFrom'] && times['timeTo']){
      timesString = this.getFormattedTime(times['timeFrom']) + " to " + this.getFormattedTime(times['timeTo']);
    }
    return (<p className="dashboardTimes">{timesString}</p>)
  }

  getFormattedTime (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + '' + minutes + amPm;
  };

  displayDays = (days) =>{
    const daysArray = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat']
    let daysString = "";
    for(let i = 0; i < daysArray.length; i++) {
        if(days[daysArray[i]]){
          daysString += daysArray[i] + ", ";
        }
    }
    return (<p className="dashboardDays">{daysString}</p>)
  }

  getClasses() {
    const { user } = this.props;
    
    this.getAllUserClasses(user.id);
  }
  
  alertIcon(pending) {
    if(pending){
     return <img className="alertIcon" src="./logo-icon.png" alt="navbar apple"/>
        }
  }

  render() {
    const { teacherClassList, studentClassList } = this.props;
    const { searchRegex} = this.props;
    const displayType = this.props.listClass;
    const filteredTeacherList = teacherClassList.filter(teacherClass => searchRegex ? searchRegex.test(teacherClass.title) : true);
    const filteredStudentList = studentClassList.filter(studentClass => searchRegex ? searchRegex.test(studentClass.title) : true);

    if(displayType === "dashboardList") {
      return (
        <div className={displayType}>
              <h2 className="classListHeaders">Teaching</h2>
              <hr className="headerHr"></hr>
              {((teacherClassList.length + studentClassList.length) > 0)?
              <div className="listHeader" id="listHeader"><h3 id="titleHeader">Title</h3><h3 id="daysHeader">Days</h3><h3 id="timeHeader">Time</h3></div>
              :
              <li></li>
              }

             <ul>
              {filteredTeacherList.length ? 
              <div className="scroll" >
              {filteredTeacherList.map((thisClass) => <li className="teacher" key={thisClass.id} data-key={thisClass.id} onClick={this.clickOnClassDashboard}>
              <p className="dashboardTitle">{this.alertIcon(thisClass.alert)}{thisClass.title}  </p> {this.displayDays(thisClass.days)}{this.displayTimes(thisClass.times)}<button className="btn btn-main createClass btn-header dashboardButton" id="deleteClassButton" onClick={(e) => {if (window.confirm('Are you sure you wish to delete this class?')) this.deleteClassOuter(e)}}>Delete Class</button></li>)} </div>
              : 
              <div className="blank">
              <p> You are currently not teaching any classes.</p>
              <p>Want to share what you know? Click "Create a Class" to get started! </p>
              </div>
            }   
            </ul> 
            
            <h2 className="classListHeaders">Enrolled In</h2>
            <hr className="headerHr"></hr>
            {((teacherClassList.length + studentClassList.length) > 0)?
              <div className="listHeader" id="listHeader"><h3 id="titleHeader">Title</h3><h3 id="daysHeader">Days</h3><h3 id="timeHeader">Time</h3></div>
              :
              <li></li>
              }
            {filteredStudentList.length ?
             <div className="scroll">
             <ul>{filteredStudentList.map((thisClass) => <li className="student" key={thisClass.id} data-key={thisClass.id} onClick={this.clickOnClassDashboard}><p className="dashboardTitle">{thisClass.title}</p>{this.displayDays(thisClass.days)}{this.displayTimes(thisClass.times)}<button className="btn btn-main createClass btn-header dashboardButton" id="deleteStudentButton" onClick={(e) => {if (window.confirm('Are you sure you wish to drop this class?')) this.deleteStudentOuter(e)}}>Drop Class</button></li>)}
             </ul>  
           </div> 
           : 
           <div className="blank">
           <p> You are not enrolled in any classes.</p>
           <p> Time to learn something new! Use "Find a Class" to enroll.</p>
           </div>
            }
        </div>        	          
      );
    } else if(displayType === "sidebarList") {
      return (
        <div className={displayType}>

          <h4>Teaching</h4>
          <ul className="sideBarContainer">{teacherClassList.map((thisClass) =>    <li className="teacher" key={thisClass.id} data-key={thisClass.id} onClick={this.clickOnClassSidebar}>{thisClass.title}</li>)}
            </ul> 

            <h4>Enrolled In</h4>
            <ul>{studentClassList.map((thisClass) =>    <li className="student" key={thisClass.id} data-key={thisClass.id} onClick={this.clickOnClassSidebar}>{thisClass.title}</li>)}</ul>  
        </div>         	          
      );
    } else {
      return (
        <div>
          not a valid display type
        </div>
      )
    }
  }
}

export default ClassList;

ClassList.propTypes = {
  searchRegex: PropTypes.object,
  teacherClassList: PropTypes.array,
  studentClassList: PropTypes.array,
  listClass: PropTypes.string,
  onClickOnClass: PropTypes.func,
  user: PropTypes.object
}
