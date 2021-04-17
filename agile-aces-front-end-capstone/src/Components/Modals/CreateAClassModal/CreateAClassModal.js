import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CreateAClassModal.css';
import classDoc from '../../../documentModels';
import { createClass } from '../../../databaseActions/classActions';

class CreateAClassModal extends Component {
  constructor(props) {
    super(props);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.state = {
      title: '',
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
  }

  componentDidMount() {
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleChecked(e) {
    this.setState({[e.target.name]: e.target.checked});
  }

  handleDate(){
    var startDate= document.getElementById('startDate').value;
    var endDate= document.getElementById('endDate').value;
    var date = new Date();
    var eDate = new Date(endDate);
    var sDate = new Date(startDate);
    
    if(startDate!== '' && startDate!== '' && sDate> eDate)
    {
      alert("Please ensure that the End Date is after the Start Date");
      return false;
    }
  
    else if(sDate <= date ){
      alert("Please enter future start date");
      return false;
    }
    return true;
  }

  handleTime(){
    var startTime= document.getElementById('timeStart').value;
    var endTime= document.getElementById('timeEnd').value;
    if(startTime > endTime ){
      alert("Please ensure end time is later than start time");
      return false;
    } 
    return true ;
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { user } = this.props;
    const {
      title, description, dateFrom, dateTo, sun, mon, tues, wed, thurs, fri, sat, timeFrom, timeTo, location } = this.state;
    const classBuilder = new classDoc();
  
    
    
    const newClass = classBuilder(
      title, description, dateFrom, dateTo, sun, mon, tues, wed, thurs, fri, sat, timeFrom, timeTo, location
    );

    if (this.handleDate() && this.handleTime()){
      newClass.titleLowerCase = newClass.title.toLowerCase();
      createClass(user, newClass)
      this.handleModalClose(e)
    }

  }
  render(){
    const {
      title, description, dateFrom, dateTo, mon, tues, wed, thurs, fri, sat, sun, timeFrom, timeTo, location
    } = this.state;
    
      return(
        <main id="createAClassModal" className="our-modal">
          <span className="close" onClick={this.handleModalClose}>&times;</span>     
            <header>
              <h1>Create a Class</h1>
            </header>
            <form id="createAClass" onSubmit={this.handleSubmit}>
            <p>Course Title* </p>            
            <input className="text-box" type="text" name="title" value={title} onChange={this.handleChange} required/>                
            <p>Description of Class*</p>              
              <input className="text-box" type="text" name="description" value={description} onChange={this.handleChange} required/>
              <p>Date From*</p>
              <div className="date-from">
                <input type="date" name="dateFrom" id="startDate" value={dateFrom} onChange={this.handleChange} required/>
                <p>to</p>
                <input type="date" name="dateTo" id="endDate" value={dateTo} onChange={this.handleChange} required/>
              </div>
              <div className="days-container" id="days">
                <div><input type="checkbox" name="sun" value={sun} onChange={this.handleChecked} />Sunday</div>
                <div><input type="checkbox" name="mon" value={mon} onChange={this.handleChecked} />Monday</div>
                <div><input type="checkbox" name="tues" value={tues} onChange={this.handleChecked} />Tuesday</div>
              </div>
              <div className="days-container">
                <div><input type="checkbox" name="wed" value={wed} onChange={this.handleChecked} />Wednesday</div>
                <div><input type="checkbox" name="thurs" value={thurs} onChange={this.handleChecked} />Thursday</div>
                <div><input type="checkbox" name="fri" value={fri} onChange={this.handleChecked} />Friday</div>
              </div>
              <input type="checkbox" name="sat" value={sat} onChange={this.handleChecked} />Saturday
              <p id="time-from">Time From*</p>
              <div className="date-from">          
                <input type="time" name="timeFrom" id="timeStart" value={timeFrom} onChange={this.handleChange} required/>
                <p>to</p>
                <input type="time" name="timeTo" id="timeEnd" value={timeTo} onChange={this.handleChange} required/>
              </div>
                <p>Location*</p>
                <input className="text-box" type="text" name="location" value={location} onChange={this.handleChange} required/>
                <section id="createAClassSubmit">
                  <button type="submit"  form="createAClass" id="createAClassButton">Submit</button>
                </section>
              </form>
          </main>
        )
    }
}

export default CreateAClassModal;

CreateAClassModal.propTypes = {
  onModalClose: PropTypes.func,
  user: PropTypes.object
}
