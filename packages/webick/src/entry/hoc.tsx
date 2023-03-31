import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { DynamicFC, StaticFC, IWindow, IContext } from '../../types';
// @ts-expect-error
import { STORE_CONTEXT } from '@dist/create-context';

let hasRender = false;

declare const window: IWindow;

const wrapComponent = (Component: DynamicFC | StaticFC) => {
  return () => {
    const [ready, setReady] = useState(Component.name !== 'dynamicComponent');
    const [props, setProps] = useState(window?.__ASYNC_DATA__ || {});
    const { dispatch } = useContext<IContext>(STORE_CONTEXT)

    const location = useLocation();
    const routerParams = {
      path: location.pathname,
      search: location.search,
      params: useParams(),
    };

    useEffect(() => {
      didMount();
    }, []);

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { fetch, layoutFetch } = Component;
        let asyncData = {};
        let asyncLayoutData = {}
        if (fetch) {
          const fetchFn = await fetch();
          asyncData = await fetchFn.default({ routerParams, _isClient: true });
        }
        if (layoutFetch) {
          asyncLayoutData = await layoutFetch({ routerParams, _isClient: true });
        }
        const combineData = Object.assign(asyncData, asyncLayoutData);
        dispatch?.({
          type: 'updateContext',
          payload: combineData
        });
        setProps(combineData);
        if (Component.name === 'dynamicComponent') {
          Component = (await (Component as DynamicFC)()).default;
          Component.fetch = fetch;
          Component.layoutFetch = layoutFetch;
          setReady(true);
        }
      }
      hasRender = true;
    };
    return ready ? <Component {...props} /> : null;
  };
};

export { wrapComponent };
