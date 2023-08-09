import React, { useReducer, useMemo } from 'react';
// @ts-expect-error
import { STORE_CONTEXT } from '@dist/create-context';

import { Action, IProps, IWindow } from '../../types';

const isDev = process.env.NODE_ENV !== 'production';

declare const window: IWindow;

const defaultState = Object.assign({}, window.__ASYNC_DATA__);

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

  const contextValue = useMemo(() => ({
    state,
    dispatch,
  }), [state, dispatch]);

  return (
    <STORE_CONTEXT.Provider value={contextValue}>
      {props.children}
    </STORE_CONTEXT.Provider>
  );
}
