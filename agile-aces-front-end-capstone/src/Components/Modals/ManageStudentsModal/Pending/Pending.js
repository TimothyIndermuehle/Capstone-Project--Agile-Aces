import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {enroll} from '../../../../databaseActions/classActions'
import {deny} from '../../../../databaseActions/classActions'

class Pending extends Component {
  constructor(props) {
    super()
    this.createPendingList = this.createPendingList.bind(this);
    this.enroll = this.enroll.bind(this);
    this.deny = this.deny.bind(this);
  }

  enroll(e) {
    const studentId = e.target.getAttribute('data-id');
    const classId = this.props.classId;
    enroll(studentId, classId);
  }

  deny(e) {
    const studentId = e.target.getAttribute('data-id');
    const classId = this.props.classId;
    deny(studentId, classId);
  }

  createPendingList = () => {
    const pendingStudents = this.props.pendingStudents.filter(student =>
      student.studentData.name.toLowerCase().includes(this.props.searchStudent.toLowerCase()));
    let list = [];
    for(let i = 0; i < pendingStudents.length; i++){
      list.push(
        <li className="liStudent">
          <p>{pendingStudents[i].studentData.name}</p>
          <div className="btnDiv">
            <button type="button" className="btn btn-sm approve" data-id={pendingStudents[i].studentRef.id} onClick={this.enroll}>Approve</button> 
            <button type="button" className="btn btn-sm deny" data-id={pendingStudents[i].studentRef.id} onClick={this.deny}>Deny</button>
          </div>
        </li>
      )
    }
    return list;
  }

  render() {
    const { pendingStudents} = this.props
      return (    
        <section>
          { pendingStudents.length ? 
          <ul id="requestingApprovalList">
            {this.createPendingList()}
          </ul>
          : 
          <p className='blank'>You have no students requesting approval. <br/> Go teach! </p>
          }
        </section>  
     );
    }        
  };

export default Pending;

Pending.propTypes = {
  classId: PropTypes.string,
  pendingStudents: PropTypes.array,
  searchStudent: PropTypes.string
}
