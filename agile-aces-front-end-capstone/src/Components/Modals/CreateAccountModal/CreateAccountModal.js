import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth, facebookProvider, googleProvider } from '../../../firebase';
import { createUser } from '../../../databaseActions/userActions';
import './CreateAccountModal.css';

class CreateAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirm: '',
    }
    this.handleModalClose = this.handleModalClose.bind(this);
    this.oAuthCreateAccount = this.oAuthCreateAccount.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }

  async createAccount(e) {
    e.preventDefault();    
    const { name, email, password, confirm } = this.state;
    const { onModalClose } = this.props;

    if (password !== confirm) alert("Sorry, passwords do not match");
    if(password.length < 6) alert("Password needs to be 6 characters or longer.")
    if(password !== confirm) return;
    const authUser = await auth.createUserWithEmailAndPassword(email,  password)
      .then(results => results.user)
      .catch((err) => {
      this.handleError(err);
      return 1;
      });
    if(authUser !== 1) authUser.updateProfile({displayName: name})
    if (authUser === 1) return;  
    let success = await createUser(authUser.uid, name, email);

    if(success){
      const authUser = await auth.signInWithEmailAndPassword(email,  password)
      .then(result => result.user)
      .catch(() => false);
      this.props.onLogin(authUser);
    }
    
  onModalClose(e);
        
  }

  handleError(e) {
    const { code, message } = e;
    switch(code){           
      case 'auth/email-already-in-use':
      case 'auth/invalid-email':
          this.setState({email: message});
          break;
      case 'auth/weak-password':
          this.setState({password: message});
          break;
      default:
    }
  }

  async oAuthCreateAccount(e) {
    const provider = e.target.value;
    const { onModalClose, onLogin } = this.props;
    const providers = { facebookProvider, googleProvider }
    const authUser = await auth.signInWithPopup(providers[provider]) 
      .then(result => result.user);
    let success = await createUser(authUser.uid, authUser.displayName,  authUser.email);
    if(success) {
      onLogin(authUser);
    } 
    onModalClose(e);
  }

  render() {
    const { name, email, password, confirm } = this.state;
      return (
        <main id="CreateAccountModal" className="our-modal" >
          <span className="close" onClick={this.handleModalClose}>&times;</span>
          <h1>Create Account</h1>
          <div id="fb-google-buttons">
            <button className="loginBtn loginBtn--facebook" value="facebookProvider"  onClick={this.oAuthCreateAccount}>Sign up with Facebook</button>
            <button className="loginBtn loginBtn--google" value="googleProvider" onClick={this.oAuthCreateAccount}>Sign up with Google</button>
          </div>
          <p>OR</p>
          <form className="sign-up" onSubmit={this.createAccount} >
            <label htmlFor="name"></label>
            <input type="text" name="name" placeholder="Name" value={name} onChange={this.handleChange} required />
            <label htmlFor="email"></label>
            <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange} required />
            <label htmlFor="password"></label>
            <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange} required />
            <label htmlFor="confirm"></label>
            <input type="password" placeholder="Confirm Password" className={confirm && (password !== confirm) ? "noMatch" : ""} name="confirm" value={confirm} onChange={this.handleChange} required />
            <input type="submit" value="Submit" />
            <button className="close cancel" onClick={this.handleModalClose}>Cancel</button>
          </form>
        </main>
      )
    }
}

export default CreateAccountModal;

CreateAccountModal.propTypes = {
  onModalClose: PropTypes.func,
  onLogin: PropTypes.func
}
