import React from 'react';
import Header from '@components/header';
import Search from '@components/search';
import { Link } from 'react-router-dom';

const arr = [1, 2, 3, 4, 5, 6];
 
export default (props) => {
  console.log('basic render');
  return (
    <div>
      <Search />
      <Header />
      <div>This is Home Page</div>
      <div>List</div>
      {
        arr.map((item) => <div key={item}><Link to={`/list/${item}`}>to {item}</Link></div>)
      }
    </div>
  );
}