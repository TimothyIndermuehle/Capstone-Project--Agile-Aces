import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassDetails from '../../../Main/Header/ClassDetails';
import './ClassAdd.css';
import 'details-polyfill';

import {requestEnrollment} from '../../../../databaseActions/classActions';

class ClassAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      targetModal: 'Default',
    };
    this.handleEnrollmentRequest = this.handleEnrollmentRequest.bind(this);
    this.handleGetMoreClasses = this.handleGetMoreClasses.bind(this);
  }

  handleGetMoreClasses() {
    const {getMoreClasses, lastClass} = this.props;
    getMoreClasses(lastClass);
  }

  handleEnrollmentRequest(e) {
    const { user } = this.props;
    requestEnrollment(user, e.target.getAttribute("data-id"))
  }

  render() {
    const { allClasses, lastClass } = this.props;
    const { pending, student, teacher } = this.props;
    const activeClasses = [...pending, ...student, ...teacher];

    return (
      <section>
        <ul id="backgroundStripes"> {
          allClasses.map(currentClass => {
          const { classId, title } = currentClass;
          return (
          <li id="classAddList" key={classId}>
            <details>
              <summary >
                <h4>{title}</h4>
                <hr></hr>
              </summary>        
              <div id="classAddClassDetails">
                <ClassDetails currentClassObject={currentClass} toggle={this.state.modalVisible} value={this.state.targetModal} currentClassTeacherName={currentClass.teacherName} />
              </div>
              {activeClasses.includes(classId) ? <div></div> : <button id="findButtons" type="button" className="btn btn-sm right" onClick={this.handleEnrollmentRequest} data-id={classId}>Request Enrollment</button>
              }
            </details>
          </li>
        )
      })
    }
        </ul>
        {lastClass ? <button id= "findClassButton" onClick={this.handleGetMoreClasses}>Click for more</button> : <div></div>}
      </section>
    );
  }
}

export default ClassAdd;

ClassAdd.propTypes={
  user: PropTypes.object,
  pending:PropTypes.array,
  student: PropTypes.array,
  teacher: PropTypes.array, 
  classToList:PropTypes.object
}
