import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';
// @ts-expect-error
import * as MyRoutes from '@dist/feRoutes.js';
import { wrapComponent } from './hoc';
import { AppContext } from './context';

import { RouteItem, IWindow } from '../../types';

const { FeRoutes } = MyRoutes as unknown as { FeRoutes: RouteItem[] };

declare const window: IWindow

const clientRender = async () => {
  for (const route of FeRoutes) {
    const { component, path } = route;
    let pathname = location.pathname;
    if (component.name === 'dynamicComponent' && pathToRegexp(path).test(pathname)) {
      // @ts-expect-error
      route.component = (await component()).default;
    }
  }
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render']((
    <BrowserRouter basename="/">
      <AppContext>
        <Routes>
          {
            FeRoutes.map((item) => {
              const { component, fetch, path } = item;
              component.fetch = fetch;
              const WrappedComponent = wrapComponent(component)
              return (
                <Route key={path} path={path} element={<WrappedComponent />} />
              )
            })
          }
        </Routes>
      </AppContext>
    </BrowserRouter>
  ), document.getElementById('app'));
}

clientRender();

export { clientRender }