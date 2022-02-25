import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Search from '@components/search';

export default function Home() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <Search />
      <span>This is List Page</span>
      <div>{searchParams.get('q')}</div>
    </div>
  );
}