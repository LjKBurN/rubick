import React from 'react';
import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom/server';
import { getManifest, findRoute, parseUrl } from '../server-utils';
// @ts-expect-error
import * as MyRoutes from '@dist/feRoutes';
import { RouteItem, IConfig } from '../../types';
// @ts-expect-error
import Layout from '@client/layout.tsx';

const { FeRoutes } = MyRoutes as unknown as { FeRoutes: RouteItem[] };


const serverRender = async (ctx: Context, config: IConfig) => {
  const { jsOrder, cssOrder, mode, isDev, isVite } = config;
  const isSSR = mode === 'ssr';

  const path = ctx.request.path;
  const routeItem = findRoute(FeRoutes, path);

  const manifest = await getManifest(config);

  const { component, fetch, webpackChunkName } = routeItem;

  const Component = (await component()).default;

  const currentFetch = fetch ? (await fetch()).default : null;

  const routerParams = parseUrl(ctx);
  const fetchData = currentFetch ? await currentFetch({ routerParams, ctx, _isClient: false }) : {};

  const injectScript = [
    <script
      key="__asyncData"
      dangerouslySetInnerHTML={{
        __html: `window.__ASYNC_DATA__=${JSON.stringify(fetchData)}`,
      }}
    />,
    (isDev && isVite) && <script key="windowVite" dangerouslySetInnerHTML={{
      __html: 'window.__USE_VITE__=true',
    }}/>,
    (isDev && isVite) && <script key="viteEntry" src="/node_modules/@ljkburn/webick/esm/src/entry/client-entry.js" type="module" />,
    ...jsOrder.map((js) => <script key={js} src={manifest[js]} type={isVite ? 'module' : ''} />),
  ];

  const injectCss: JSX.Element[] = [];

  let dynamicCssOrder = cssOrder.concat([`${webpackChunkName}.css`]);
  dynamicCssOrder.forEach((css) => {
    if (manifest[css]) {
      const item = manifest[css];
      injectCss.push(<link rel="stylesheet" key={item} href={item} />);
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

  const injectState = isSSR ? (
    <script dangerouslySetInnerHTML={{ __html: `window.__USE_SSR__=true;` }} />
  ) : null;
  return (
    <StaticRouter location={ctx.request.url}>
      <Layout
        injectScript={injectScript}
        injectCss={injectCss}
        injectState={injectState}
      >
        <Component {...fetchData} />
      </Layout>
    </StaticRouter>
  );
};

export { serverRender };
