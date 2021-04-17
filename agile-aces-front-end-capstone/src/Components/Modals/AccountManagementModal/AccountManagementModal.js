import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AccountManagementModal.css';
import { auth } from 'firebase';
import { updateUser } from '../../../databaseActions/userActions';

class AccountManagementModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: auth().currentUser,
      name: '',
      currentEmail: auth().currentUser.email,
      email: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      message: '',
    }
    this.handleModalClose =this.handleModalClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.oAuthUpdateProfile =this.oAuthUpdateProfile.bind(this);
    this.updateEmailProfile =this.updateEmailProfile.bind(this);
    this.updateUser = updateUser.bind(this)
  }
    
  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e)
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }

  oAuthUpdateProfile(e){
    e.preventDefault();
    const {authUser, name} = this.state;
    const updateFields = {name}
    this.updateUser(authUser, updateFields)
  }

  async updateEmailProfile(e){
    e.preventDefault();
    const {authUser, name, currentEmail, email, password, newPassword, confirmPassword} = this.state;
    const updateFields = {name, email, newPassword}
    if(!name && !email && !newPassword && !confirmPassword){
      this.setState({message: 'Please make changes before submitting'});
      return false;
  }
  if(newPassword.length < 6 && newPassword.length !== 0){
    this.setState({message: 'Password must be a  least 6 characters long'})
    return false;
  }else if(newPassword !== confirmPassword){
    this.setState({message: 'Passwords must match'})
    return false;
  }else {
    const credential = await auth.EmailAuthProvider.credential(
      currentEmail, 
      password
    );
    const reauthenticated = await authUser.reauthenticateAndRetrieveDataWithCredential(credential)
      .then(res => res)
      .catch(err => alert("Invalid Password"));
    if(reauthenticated){
      await this.updateUser(authUser, updateFields);
    }
  }
}

  render() {
    const {authUser: {displayName, email: authEmail, providerData: [providerObj] }, name, email, password, newPassword,confirmPassword, message} = this.state;
    const {providerId: provider} = providerObj;
    if(provider === 'google.com' || provider === 'facebook.com'){
      return (
      <main id="AccountManagementModal" className="our-modal">
        <span className="close" onClick={this.handleModalClose}>&times;</span>
        <header>
          <h1>Edit Profile</h1>
        </header>
        <p>{message}</p>
        <form className="update-profile" onSubmit={this.oAuthUpdateProfile}>
          <input type="text" name="name" value={name} onChange={this.handleChange} placeholder={displayName}/>
          <p>{authEmail}</p>
          <input type="submit" value="Submit"></input>
          <button className="close cancel"><label onClick={this.handleModalClose}>Cancel</label></button>
        </form>
      </main>
      
    )
      }else {
        return (     
          <main id="AccountManagementModal" className="our-modal">
            <span className="close" onClick={this.handleModalClose}>&times;</span>
            <header>
              <h1>Edit Profile</h1>
            </header>
            <p>{message}</p>
            <form className="update-profile" onSubmit={this.updateEmailProfile}>
              <input type="text" name="name" value={name} onChange={this.handleChange} placeholder={displayName}/>
              <input type="email" name="email" value={email} onChange={this.handleChange} placeholder={authEmail}/>
              <input type="password" name="password" value={password} onChange={this.handleChange} placeholder="Password" required/>
              <input type="password" name="newPassword" value={newPassword} onChange={this.handleChange} placeholder="New Password"/>
              <input type="password" className={newPassword && (newPassword !== confirmPassword) ? "noMatch" : ""} name="confirmPassword" value={confirmPassword} onChange={this.handleChange} placeholder="Confirm Password"/>
              <input type="submit" value="Change"></input>
              <button className="close cancel"><label onClick={this.handleModalClose}>Cancel</label></button>
            </form>
        </main>
      )
    }
  }
}

export default AccountManagementModal;

AccountManagementModal.propTypes = {
  onModalClose: PropTypes.func
}
