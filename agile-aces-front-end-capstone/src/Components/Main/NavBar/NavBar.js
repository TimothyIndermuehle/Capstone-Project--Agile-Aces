import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modals from '../../Modals/Modals';
import { auth } from '../../../firebase';
import './NavBar.css';
import './../SideBar.css';

export default class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      targetModal: 'Default',
    }
    this.toggleModals = this.toggleModals.bind(this);
    this.logout = this.logout.bind(this);
  }
    
  toggleModals(e) {
    const { modalVisible, targetModal } = this.state;
      this.setState({
        modalVisible: !modalVisible,
        targetModal: targetModal === 'Default' ? e.target.getAttribute("value") : 'Default',
        }
      )
     }
    
  logout() {
    const { onLogout } = this.props;
    auth.signOut()
    onLogout(null);   
  }
  
  render() {
    const { modalVisible, targetModal } = this.state;
    const { name, view, onClick, toggleClassList, classListOpen } = this.props;
    return (
     <div id="navContainer">
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <label className="navbar-brand">
          <img src={`${process.env.PUBLIC_URL}/logo-icon.png`} alt="navbar apple"></img>
        </label>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse desktop" id="navbarText">
          <ul className="navbar-nav mr-auto">
            {view !=='dashboard' ?
              <li className="st-view nav-item">
                <label className="nav-link" data-toggle="collapse" data-target="#navbarText"  onClick={onClick}>Dashboard</label>
              </li>
              :
              <li></li>
            }
            <li className="nav-item" id="openClassList" onClick={toggleClassList} data-toggle="collapse" data-target="#navbarText">
              {classListOpen ?
              <label htmlFor="slideSidebar" className="nav-link">Close Class List</label> : <label htmlFor="slideSidebar" className="nav-link">Open Class List</label> }
            </li>
          </ul>
            <div className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{name}</span>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li className="dropdown-item">
                      <label className="nav-link" id="accountManagement" value="AccountManagementModal" data-toggle="collapse" data-target="#navbarText" onClick={this.toggleModals}>Profile</label>
                    </li>
                    <hr/>
                    <li className="dropdown-item"><label className="nav-link" onClick={this.logout}>Logout</label>
                  </li>
              </div>
            </div>
        </div>    
      </nav>
      <Modals toggle={modalVisible} value={targetModal} onModalClose={this.toggleModals} />
    </div>
    )
  }
}
NavBar.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
  onLogout: PropTypes.func 
}
