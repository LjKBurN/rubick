import React from 'react';
import Search from '@components/search';

export default function Home(props) {
  const { data } = props;
  return (
    <div>
      <Search />
      <div>this is list page</div>
      <div>{data}</div>
    </div>
  );
}