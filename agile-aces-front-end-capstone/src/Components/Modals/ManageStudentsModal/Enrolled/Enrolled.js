import React, { Component } from 'react';
import PropTypes from 'prop-types';


import {deleteStudent} from '../../../../databaseActions/classActions'

class Enrolled extends Component {
    constructor(props) {
        super();
        this.createEnrolledList = this.createEnrolledList.bind(this);
        this.delete = this.delete.bind(this);
    }

    delete(e) {
      const classId = this.props.classId;
      const studentId = e.target.getAttribute('data-id');
      deleteStudent(studentId, classId);
    }

    createEnrolledList = () =>{
      const enrolledStudents = this.props.enrolledStudents.filter(student =>
        student.studentData.name.toLowerCase().includes(this.props.searchStudent.toLowerCase()));

      let list = [];
      for(let i = 0; i < enrolledStudents.length; i++){
        list.push(
          <li className="liStudent">
          <p>{enrolledStudents[i].studentData.name}</p>
          <div className="btnDiv">
            <button type="button" className="delete-student btn btn-sm deny" data-id={enrolledStudents[i].studentRef.id} onClick={this.delete}>Delete</button>
          </div>
        </li>
        )
      }
      return list;
    }
    render() {
      const { enrolledStudents } = this.props
        return (
            <section>
              { enrolledStudents.length ? 
              <ul>
                {this.createEnrolledList()}
              </ul>    
              :
              <p className="blank"> No students currently enrolled</p>
            } 
            </section>
           
           

        )
    }
}

export default Enrolled;
Enrolled.propTypes ={
  classId: PropTypes.string,
  enrolledStudents: PropTypes.array,
  searchStudent: PropTypes.string
}
