import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Modals.css';
import ModalsIndex from './index';

const hidden = { display: "none"};
const visible = { display: "flex" };
class Modals extends Component {
  constructor(props) {
    super(props);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }

  render() {
    const {user, toggle, value, topic, currentClassObject, pending, student, teacher, pendingStudents, enrolledStudents, onLogin} = this.props;
    const Modal = ModalsIndex[value];
    return (
      <div className="Modals" style={toggle ? visible : hidden}>
        <Modal user={user} onModalClose={this.handleModalClose} topic={topic} currentClassObject={currentClassObject} pending={pending} student={student} teacher={teacher} pendingStudents={pendingStudents} enrolledStudents={enrolledStudents} onLogin={onLogin}/>
      </div>
    );
  }
}

export default Modals;

Modals.propTypes = {
  user: PropTypes.object,
}
