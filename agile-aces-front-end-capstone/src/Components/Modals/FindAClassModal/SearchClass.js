import React, { Component } from 'react';
import './SearchClass.css';

class SearchClass extends Component {
  render() {
    return (
      <section>
        <input type="text" name="class-name" placeholder="Type class name"></input>
      </section>
    );
  };
}

export default SearchClass;
