import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ManageStudentsModal.css';
import Pending from './Pending/Pending';
import Enrolled from './Enrolled/Enrolled';

class ManageStudentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentName: ''
    }
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;

    onModalClose(e);
  }

  handleChange(e) {
    e.preventDefault()

    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    return (   
      <main className="ManageStudentsModal our-modal">
        <span className="close " onClick={this.handleModalClose}>&times;</span>
        <h1>Manage Students</h1>
        <input id="desktop" type="text" name="studentName" placeholder="Type student name" onChange={this.handleChange}></input>
        <h2>Requesting Approval</h2>
        <div className="scrollStudents">
          <Pending pendingStudents={this.props.pendingStudents} searchStudent={this.state.studentName} classId={this.props.currentClassObject.id}/>
        </div>
        <h2>Students Currently Enrolled</h2>
        <div className="scrollStudents">
          <Enrolled enrolledStudents={this.props.enrolledStudents} searchStudent={this.state.studentName} classId={this.props.currentClassObject.id}/>
        </div>
      </main>
    );
  }
}

export default ManageStudentsModal;

ManageStudentsModal.propTypes = {
  classId: PropTypes.string,
  pendingStudents: PropTypes.array,
  enrolledStudents: PropTypes.array,
  currentClassObject: PropTypes.object,
  onModalClose: PropTypes.func
}
