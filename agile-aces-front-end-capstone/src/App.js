import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Main from './Components/Main/Main';
import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


import { users, auth } from './firebase';
import { getUser } from './databaseActions/userActions';

class App extends Component {
  constructor() {
    super();
    this.state ={
      loading: true,
      user: null,
      name: null
    }
    this.toggleLogin = this.toggleLogin.bind(this);
    this.getUser = getUser.bind(this);
  }

  toggleLogin(e) {
    e ? this.getUser(e.uid) : this.setState({user: null, name: null});
}
  
  componentDidMount() {
    library.add(faSearch)
    users.get().then(function(querySnapshot) {
      const currentusers = [];
      querySnapshot.forEach(doc => currentusers.push(doc.id));
      return currentusers;
    })
    .then(currentusers => {      
      auth.onAuthStateChanged((authUser) => {
        const { uid } = authUser;
        const hasAccount = authUser && currentusers.includes(uid);
        if (hasAccount) {
          this.getUser(uid)
        }
      });
    })

    demoAsyncCall().then(() => this.setState({ loading: false }));  
  }

  render() {
    const { loading, user, name } = this.state;
    if(loading) return null;

    return (
      <div className="App">
        {user ?
          <Main user={user} name={name} onLogout={this.toggleLogin}/>
          :
          <Login onLogin={this.toggleLogin} />
        }
      </div>
    );
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 2000));
}

export default App;
