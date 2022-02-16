import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { DynamicFC, StaticFC, IWindow } from '../../types';

let hasRender = false;

declare const window: IWindow

function wrapComponent(Component: DynamicFC|StaticFC) {
  return () => {
    const [ready, setReady] = useState(Component.name !== 'dynamicComponent')
    const [props, setProps] = useState({});

    const routerParams = {
      location: useLocation(),
      params: useParams(),
    }

    useEffect(() => {
      didMount();
    }, []);

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        console.log('client render');
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { fetch, layoutFetch } = Component;
        let asyncData = {};
        if (fetch) {
          const fetchFn = await fetch();
          asyncData = await fetchFn.default({ routerParams, _isClient: true });
        }
        setProps({ asyncData });
        if (Component.name === 'dynamicComponent') {
          Component = (await (Component as DynamicFC)()).default;
          Component.fetch = fetch;
          Component.layoutFetch = layoutFetch;
          setReady(true);
        }
      }
      hasRender = true;
    }

    return (
      ready ? <Component {...props} /> : null
    )
  }
}

export { wrapComponent }