import React from 'react';
import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom/server';
import { getManifest, findRoute, parseUrl } from '../server-utils';
// @ts-expect-error
import * as MyRoutes from '@dist/feRoutes';
// @ts-expect-error
import { STORE_CONTEXT } from '@dist/create-context'
// @ts-expect-error
import Layout from '@components/layout/index';

import { RoutesType, IConfig } from '../../types';

const { FeRoutes, layoutFetch } = MyRoutes as unknown as RoutesType;


const serverRender = async (ctx: Context, config: IConfig) => {
  const { jsOrder, cssOrder, mode, isDev, isVite } = config;
  const isSSR = mode === 'ssr';

  const path = ctx.request.path;
  const routeItem = findRoute(FeRoutes, path);

  const manifest = await getManifest(config);

  const { component, fetch, webpackChunkName } = routeItem;

  const Component = isSSR ? (await component()).default : React.Fragment;

  let [layoutFetchData, fetchData] = [{}, {}]

  const currentFetch = fetch ? (await fetch()).default : null;

  if (isSSR) {
    const routerParams = parseUrl(ctx);
    layoutFetchData = layoutFetch ? await layoutFetch({ routerParams, ctx, _isClient: false }) : {};
    fetchData = currentFetch ? await currentFetch({ routerParams, ctx, _isClient: false }) : {};
  }

  const combineData = Object.assign(layoutFetchData, fetchData);

  const injectScript = [
    <script
      key="__asyncData"
      dangerouslySetInnerHTML={{
        __html: `window.__ASYNC_DATA__=${JSON.stringify(combineData)}`,
      }}
    />,
    (isDev && isVite) && <script key="windowVite" dangerouslySetInnerHTML={{
      __html: 'window.__USE_VITE__=true',
    }}/>,
    (isDev && isVite) && <script key="viteEntry" src="/node_modules/webick/esm/src/entry/client-entry.js" type="module" />,
    ...jsOrder.map(js => manifest[js]).filter(Boolean).map(item => <script key={item} src={item} type={isVite ? 'module' : 'text/javascript'} />),
  ];

  const injectCss: JSX.Element[] = [];

  let dynamicCssOrder = cssOrder.concat([`${webpackChunkName}.css`]);

  // 引入被 mini-css-extract-plugin 分离的按需引入样式文件（antd）
  Object.keys(manifest).forEach((name) => {
    if (name.startsWith('static/css/')) {
      dynamicCssOrder.push(name);
    }
  });

  if (isDev && isVite) {
    injectCss.push(<script src="/@vite/client" type="module" key="vite-client"/>);
    injectCss.push(<script key="vite-react-refresh" type="module" dangerouslySetInnerHTML={{
      __html: ` import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true`
    }} />);
  }

  dynamicCssOrder.forEach((css) => {
    if (manifest[css]) {
      const item = manifest[css];
      injectCss.push(<link rel="stylesheet" key={item} href={item} />);
    }
  });

  // preload
  jsOrder.map(js => manifest[js]).filter(Boolean).forEach(js => {
    injectCss.push(<link href={js} as="script" rel={isVite ? 'modulepreload' : 'preload'}/>);
  });

  const innerHtml = `window.__USE_SSR__=${isSSR}`;

  const injectState = <script dangerouslySetInnerHTML={{ __html: innerHtml }} />
  return (
    <StaticRouter location={ctx.request.url}>
      <STORE_CONTEXT.Provider value={{ state: combineData }}>
        <Layout
          injectScript={injectScript}
          injectCss={injectCss}
          injectState={injectState}
        >
          <Component {...combineData} />
        </Layout>
      </STORE_CONTEXT.Provider>
    </StaticRouter>
  );
};

export { serverRender };
