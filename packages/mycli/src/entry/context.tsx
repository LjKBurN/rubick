import React, { useReducer } from 'react';
// @ts-expect-error
import { STORE_CONTEXT } from '@dist/create-context';

import { Action, IProps } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

const defaultState = {};

function defaultReducer(state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      if (isDev) {
        // console.log('[SSR:updateContext]: dispatch updateContext with action')
      }
      return { ...state, ...action.payload };
  }
}

export function AppContext(props: IProps) {
  const [state, dispatch] = useReducer(defaultReducer, defaultState);
  return (
    <STORE_CONTEXT.Provider value={{ state, dispatch }}>
      {props.children}
    </STORE_CONTEXT.Provider>
  );
}
