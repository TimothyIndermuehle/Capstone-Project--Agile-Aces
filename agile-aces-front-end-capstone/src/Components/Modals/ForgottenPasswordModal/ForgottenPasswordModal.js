import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../../firebase';
import './ForgottenPasswordModal.css';

class ForgottenPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    }
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({email: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const { onModalClose } = this.props;
    const { email } = this.state;

    auth.sendPasswordResetEmail(email)
      .then(() => console.log('Email sent'))
      .catch(err => console.error('There was a problem sending the email', err));
      onModalClose(e);
      alert("Please check your email folder. Link sent to reset password.")
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }

  render() {
    const { email } = this.state;
    return ( 
      <main className="ForgottenPasswordModal our-modal flex-container">
        <span className="close" onClick={this.handleModalClose}>&times;</span>
        <header>
          <h1>Forgot Password?</h1>
        </header>
        <p className="left">Please enter your email address to request a password reset.</p>
        <section>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input type="email" name="email" value={email} onChange={this.handleChange} placeholder="Enter Email" />
            </div>
            <button type="submit" className="btn resetButton" id="forgotButton">Submit</button>
          </form>
        </section>
      </main>
    );
  }
}

export default ForgottenPasswordModal;

ForgottenPasswordModal.propTypes = {
  onModalClose: PropTypes.func
}

