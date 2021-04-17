import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import Modals from '../Modals/Modals';
import { users, auth, facebookProvider, googleProvider } from '../../firebase';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: '',
      email: '',
      modalVisible: false,
      targetModal: 'Default',
      passwordPlaceholder: '',
      invalid: false,
    }
    //this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.toggleModals = this.toggleModals.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value, invalid: false});
  }

  handleKeyDown(e) {
    const {password, email} = this.state;
    if(e.keyCode === 13){
      if(password && email){
        this.login(e)
      }else{
        alert("Please enter a valid email and password")
      }
      e.preventDefault()
    }else{
      this.handleChange(e)
    }
  }


  async login(e) {
    e.preventDefault();
    const provider = e.target.value;
    const providers = { facebookProvider, googleProvider };
    const {password, email} = this.state;
    const { onLogin } = this.props;
    let authUser;
    if (provider === 'facebookProvider' || provider === 'googleProvider') {
      authUser = await auth.signInWithPopup(providers[provider]) 
        .then(result => result.user);
    } else {
      authUser = await auth.signInWithEmailAndPassword(email, password)
        .then(result => result.user)
        .catch(() => false);
    }
    const accounts = await users.get().then(function(querySnapshot) {
      const currentusers = [];
      querySnapshot.forEach(doc => currentusers.push(doc.id));
      return currentusers;
    });

    const hasAccount = accounts.includes(authUser.uid);
    if(hasAccount) {
      onLogin(authUser);
    } else {
      this.setState({
        invalid: true
      })
    }
  }

  toggleModals(e) {
    e.preventDefault();
    const { modalVisible, targetModal } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      targetModal: targetModal === 'Default' ? e.target.value : 'Default',
    })
  }

  render() {
    const { invalid, email, password, passwordPlaceholder, targetModal, modalVisible } = this.state;
    const { onLogin } = this.props;
    return (
      <div className="Login">
        <header>
          <img src={`${process.env.PUBLIC_URL}/logo-main.png`} className="logo" alt="Apple with Text Teach Me More"></img>
        </header>
        <section className="large">
            {invalid ?
              <div id="invalidContainer">
                <label id="invalidEmail">Email or password is incorrect</label>
              </div>
              :
              <div>
              </div>
            }
          <form value={false} onSubmit={this.login}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder={passwordPlaceholder} value={password} onChange={this.handleChange} onKeyDown={this.handleKeyDown}></input>
              <button className="center btnLink" value="ForgottenPasswordModal" onClick={this.toggleModals}>Forgot password?</button>
            <button id="submitLarge" type="submit" name="submit">Login</button>
          </form>
        </section>
         <section className="small">
          {invalid ?
                <div id="invalidContainer">
                  <label id="invalidEmail">Email or password is incorrect</label>
                </div>
                :
                <div>
                </div>
          }
          <form value={false} onSubmit={this.login}>
            <input type="email" name="email" placeholder="Email" value={email} onChange={this.handleChange}></input>
            <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange}></input>
            <button className="center btnLink" value="ForgottenPasswordModal" onClick={this.toggleModals}>Forgot password?</button>
            <button id="submitSmall" type="submit" name="submit">Log in</button>
          </form>
          <p>OR</p>
        </section>
        <section>
          <button className="loginBtn loginBtn--facebook" value="facebookProvider" onClick={this.login}>
            Log in with Facebook
          </button>
          <button className="loginBtn loginBtn--google" value="googleProvider" onClick={this.login}>
            Log in with Google
          </button>
        </section>
        <button className="btn createAccount" value="CreateAccountModal" onClick={this.toggleModals}>Create Account</button>
        <Modals toggle={modalVisible} value={targetModal} onModalClose={this.toggleModals} onLogin={onLogin}/>
      </div>
    );
  }
}

export default Login;

Login.propTypes = {
  onLogin: PropTypes.func
}
