import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FindAClassModal.css';
import ClassAdd from './ClassAdd/ClassAdd';
import {startSearchAllClasses, pageSearchAllClasses} from '../../../databaseActions/classActions';

class FindAClassModal extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      allClasses: [],
      lastClass: null,
      search: '',
    }
    this.searchBar = this.searchBar.bind(this);
    this.getMoreClasses = this.getMoreClasses.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);        
    this.startSearchAllClasses = startSearchAllClasses.bind(this);
    this.pageSearchAllClasses = pageSearchAllClasses.bind(this);
  }
  componentDidMount() {
    const {search} = this.state;
    this.startSearchAllClasses(search);
  }

  handleModalClose(e) {
    const { onModalClose } = this.props;
    onModalClose(e);
  }

  getMoreClasses(lastClass) {
    const { search } = this.state;

    this.pageSearchAllClasses(lastClass, search);
  }

  searchBar(e) {
    e.preventDefault();
    let search = e.target.value.toLowerCase();
    this.setState({search})
    this.startSearchAllClasses(search);
  }
    
  render(){
    const {pending, teacher, student, user} = this.props;
    const { allClasses, lastClass } = this.state;
      return(
        <main id="findAClassModal" className="our-modal">
          <span className="close" onClick={this.handleModalClose}>&times;</span>
          <header>
            <h1>Find a Class</h1>
         </header>
          <section onChange= { this.searchBar } >
            <input id="classSearchBar" type="text" name="class-name" placeholder="Type class name"/>
          </section>
          <section id="sectionBox">
            <ClassAdd user={user} className="entry" getMoreClasses={this.getMoreClasses} allClasses={allClasses} lastClass={lastClass} pending={pending} teacher={teacher} student={student}/>
          </section>
        </main>
      )
    }
}

export default FindAClassModal;

FindAClassModal.propTypes ={
  student: PropTypes.array,
  user: PropTypes.object,
  onModalClose: PropTypes.func,
  pending: PropTypes.array,
  teacher: PropTypes.array
}
