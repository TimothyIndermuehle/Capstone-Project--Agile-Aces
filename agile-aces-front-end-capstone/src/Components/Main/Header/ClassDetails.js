import React from 'react';
import './ClassDetails.css';
import classDoc from '../../../documentModels';
import Modals from '../../Modals/Modals';
// import { users, classes } from '../../../firebase';
import { updateClass } from '../../../databaseActions/classActions'; 
// import classes from '*.module.scss';
// import {getTeacher} from '../../../databaseActions/userActions';


export default class ClassDetails extends React.Component {
  constructor(props) {
    super();
    this.state = {
      modalVisible: false,
      targetModal: 'Default',
      editButton: 'Edit Class Details',
      edit: false,
      title: '',
      newTitle: '',
      description: '',
      dateFrom: '',
      dateTo: '',
      sun: false,
      mon: false,
      tues: false,
      wed: false,
      thurs: false,
      fri: false,
      sat: false,
      timeFrom: '',
      timeTo: '',
      location: '',
    }
    this.displayDays = this.displayDays.bind(this);
    this.toggleModals = this.toggleModals.bind(this);
    this.handleEdit = this.handleEdit.bind(this)
    this.displayDate = this.displayDate.bind(this)
    this.formatDate = this.formatDate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.updateClass = updateClass.bind(this);
    this.alertIcon = this.alertIcon.bind(this)
  }

  toggleModals(e) {
    e.preventDefault();
    const { modalVisible, targetModal } = this.state;
      this.setState({
        modalVisible: !modalVisible,
        targetModal: targetModal === 'Default' ? e.target.getAttribute("value") : 'Default',
      })
  }

  handleChecked(e) {
    this.setState({[e.target.name]: e.target.checked});
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleEdit(e) {
    e.preventDefault();
    const {edit} = this.state;
    if(!edit){
      this.setState({
        edit: true,
        editButton: 'Submit Changes'
      })
    }else{
      this.setState({
        edit: false,
        editButton: 'Edit Class Details'
      })
    }
  }

  deleteClassOuter(e) {
    e.preventDefault();
    const classId = this.props.currentClassObject.id;
    const teacherId = this.props.currentClassObject.teacher.id;
    this.deleteClass(classId, teacherId);
    this.props.onClick();
  }

  handleDate() {
    var startDate= this.state.dateFrom;
    var endDate= this.state.dateTo;
    var eDate = new Date(endDate);
    var sDate = new Date(startDate);
    
    if(this.state.dateFrom!== '' && this.state.dateFrom!== '' && sDate> eDate)
    {
      alert("Please ensure that the End Date is after the Start Date");
      return false;
    }
    return true;
  }

  handleTime() {
    if(this.state.timeFrom > this.state.timeTo ){
      alert("Please ensure end time is later than start time");
      return false;
    } 
    return true ;
  }

  displayDate = (dateFrom, dateTo) => {
    const startDate = this.formatDate(dateFrom)
    const endDate = this.formatDate(dateTo)
    return `${startDate} to ${endDate}`
  }

  formatDate = (date) => {
    const month = date.slice(5,7)
    const day = date.slice(8,10)
    const year = date.slice(0,4)
    return `${month}-${day}-${year}`
  }

  getFormattedTime (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + '' + minutes + amPm;
  };

  displayDays = (days) => {
    const daysArray = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat']
    let daysString = "";
    for(let i = 0; i < daysArray.length; i++) {
      if(days[daysArray[i]]){
        daysString += daysArray[i] +' ';
      }
    }
    return daysString;
  }
   
  alertIcon(pendingStudents) {
    if(pendingStudents.length > 0){
     return <img className="alertIcon" src="./logo-icon.png" alt="navbar apple" value="ManageStudentsModal"/>
        }
  }

  async handleSubmit() {
    const {
      title,
      description,
      dateFrom,
      dateTo,
      sun,
      mon,
      tues,
      wed,
      thurs,
      fri,
      sat,
      timeFrom,
      timeTo,
      location, } = this.state;
    const classBuilder = new classDoc();
    const updateClass = classBuilder(
      title,
      description,
      dateFrom,
      dateTo,
      sun,
      mon,
      tues,
      wed,
      thurs,
      fri,
      sat,
      timeFrom,
      timeTo,
      location);

    if (this.handleDate() && this.handleTime()){
      this.updateClass(this.props.currentClassObject.id, updateClass)
      this.setState({
        edit: false,
        editButton: 'Edit Class Details'
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentClassObject.id !== prevProps.currentClassObject.id) {
      const {title, description, dates, days, times, location} = this.props.currentClassObject
      this.setState({
        edit: false,
        editButton: 'Edit Class Details',
        title: title,
        description: description,
        dateFrom: dates.dateFrom,
        dateTo: dates.dateTo,
        mon: days.mon,
        tues: days.tues,
        wed: days.wed,
        thurs: days.thurs,
        fri: days.fri,
        sat: days.sat,
        sun: days.sun,
        timeFrom: times.timeFrom,
        timeTo:times.timeTo,
        location: location,
      })
    }
  }

  componentDidMount() {
    const {title, description, dates, days, times, location} = this.props.currentClassObject
      this.setState({
      title: title,
      description: description,
      dateFrom: dates.dateFrom,
      dateTo: dates.dateTo,
      mon: days.mon,
      tues: days.tues,
      wed: days.wed,
      thurs: days.thurs,
      fri: days.fri,
      sat: days.sat,
      sun: days.sun,
      timeFrom: times.timeFrom,
      timeTo:times.timeTo,
      location: location,
      })
   }
  render() {
    const { title,
      description,
      dateFrom,
      dateTo,
      mon,
      tues,
      wed,
      thurs,
      fri,
      sat,
      sun,
      timeFrom,
      timeTo,
      location, edit } = this.state;
    if(this.props.view === "teacher") {
      if(edit){
        return (
          <section className="classInfo">
            <form className="editClass">
              <div className="classInfoTeacherDes">
              <h4>Title:</h4>
              <input type="text" name="title" value={title} onChange={this.handleChange}/>
              <h4>Description</h4>
                <input type="text" name="description" value={description} onChange={this.handleChange}/>
              <h4>Location:</h4>
              <input type="text" name="location" value={location} onChange={this.handleChange}></input>
              </div>
              <div className="classInfoAdditional">
                <h4>Days:</h4>
                <div className="days-container" id="days">
                <div><input type="checkbox" name="sun" value={sun} onChange={this.handleChecked} />Sunday</div>
                <div><input type="checkbox" name="mon" value={mon} onChange={this.handleChecked} />Monday</div>
                <div><input type="checkbox" name="tues" value={tues} onChange={this.handleChecked} />Tuesday</div>
  
                <div><input type="checkbox" name="wed" value={wed} onChange={this.handleChecked} />Wednesday</div>
                <div><input type="checkbox" name="thurs" value={thurs} onChange={this.handleChecked} />Thursday</div>
                <div><input type="checkbox" name="fri" value={fri} onChange={this.handleChecked} />Friday</div>
                <div><input type="checkbox" name="sat" value={sat} onChange={this.handleChecked} />Saturday</div>
                </div>
                <h4>Dates:</h4>
                <div className="dates">
                  <input type="date" name="dateFrom" value={dateFrom} id="startDate" onChange={this.handleChange} /> 
                    to 
                  <input type="date" name="dateTo" id="endDate" value={dateTo} onChange={this.handleChange} />
                </div>
                <h4>Times:</h4>
                <div className="times">
                  <input type="time" name="timeFrom" id="timeStart" value={timeFrom} onChange={this.handleChange} />
                  to 
                  <input type="time" name="timeTo" id="timeEnd" value={timeTo} onChange={this.handleChange} />
                </div>
              </div>
              </form>
              <div className="headerButtons">
              <button type="submit" form="editClass" className="btn btn-main btn-header" onClick={this.handleSubmit}>{this.state.editButton}</button>
              <button className="btn btn-main btn-header" onClick={this.handleEdit}>Cancel</button>
            </div>
            <Modals toggle={this.state.modalVisible} value={this.state.targetModal} onModalClose={this.toggleModals} currentClassObject={this.props.currentClassObject} pendingStudents={this.props.pendingStudents} enrolledStudents={this.props.enrolledStudents}/>
          </section>  
        )
      }else {
      return (
        <section className="classInfo teacher container-fluid">
          <div className="classInfoTeacherDes">
            <label className="classInfoHeader">Teacher:</label>
            <p className="days">{this.props.currentClassTeacherName}</p>
            <label className="classInfoHeader">Description:</label>
            <p>{this.props.currentClassObject.description}</p>
            <label className="classInfoHeader">Location:</label>
            <p>{this.props.currentClassObject.location}</p>
          </div>
          <div className="classInfoAdditional">
            <label className="classInfoHeader">Days:</label>
            <p className="days">{this.displayDays(this.props.currentClassObject.days)}</p>
            <label className="classInfoHeader">Dates:</label>
            <p>{this.props.currentClassObject.dates.dateFrom? this.displayDate(this.props.currentClassObject.dates.dateFrom, this.props.currentClassObject.dates.dateTo) : null}</p>
            <label className="classInfoHeader">Times:</label>
            <p>{this.props.currentClassObject.times.timeFrom ? `${this.getFormattedTime(this.props.currentClassObject.times.timeFrom)} to ${this.getFormattedTime(this.props.currentClassObject.times.timeTo)}`: null} </p>
          </div>
          <div className="headerButtons">
            <button type="button" className="btn btn-main btn-header" value="ManageStudentsModal" onClick={this.toggleModals}> {this.alertIcon(this.props.pendingStudents)} Manage Students</button>
            <button type="button" className="btn btn-main btn-header" value="ManageStudentsModal" onClick={this.handleEdit}>{this.state.editButton}</button>
          </div>
          <Modals toggle={this.state.modalVisible} value={this.state.targetModal} onModalClose={this.toggleModals} currentClassObject={this.props.currentClassObject} pendingStudents={this.props.pendingStudents} enrolledStudents={this.props.enrolledStudents}/>
        </section>  
      )
    }
    }else {
      const {
        currentClassTeacherName, 
        currentClassObject: {
          description,
          location,
          days,
          dates: {
            dateFrom,
            dateTo,
          },
        },
      } = this.props;
        return (
          <section className="classInfo container-fluid">
            <div className="classInfoTeacherDes">
              <label className="classInfoHeader">Teacher:</label>
              <p>{currentClassTeacherName}</p>
              <label className="classInfoHeader">Description:</label>
              <p>{description}</p>
            </div>
            <div className="classInfoAdditional">
              <label className="classInfoHeader">Location:</label>
              <p>{location}</p>
              <label className="classInfoHeader">Schedule:</label>
              <p>{this.displayDays(days)}</p>
              <label className="classInfoHeader">Dates:</label>
              <p>{this.displayDate(dateFrom, dateTo)}</p>
            </div>
          </section>  
        )
     } 
  }
}
