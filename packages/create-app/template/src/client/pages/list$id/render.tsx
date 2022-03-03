import React from 'react';
import { Link } from 'react-router-dom';
import Search from '@components/search';

export default function Home(props) {
  const { id } = props;
  console.log(props);
  return (
    <div>
      <Search />
      <div>
        <Link to="/">⬅️back</Link>
      </div>
      <span>This is List {id} Page</span>
      <div>
        <Link to={`/list/${id}/detail`}>see the detail</Link>
      </div>
    </div>
  );
}