import React from 'react';
import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom/server';
import { getManifest, findRoute, loadConfig, parseUrl } from '../server-utils';
// @ts-expect-error
import * as MyRoutes from '@dist/feRoutes';
import { RouteItem } from '../../types';
// @ts-expect-error
import Layout from '@client/layout.tsx';

const { FeRoutes } = MyRoutes as unknown as { FeRoutes: RouteItem[] };

const { jsOrder, cssOrder, mode } = loadConfig();

const isSSR = mode === 'ssr';

const serverRender = async (ctx: Context) => {
  const path = ctx.request.path;
  const routeItem = findRoute(FeRoutes, path);

  const manifest = await getManifest();

  const { component, fetch, webpackChunkName } = routeItem;

  const Component = (await component()).default;

  const currentFetch = fetch ? (await fetch()).default : null;

  const routerParams = parseUrl(ctx);
  const fetchData = currentFetch ? await currentFetch({ routerParams, ctx, _isClient: false }) : {};

  const injectScript = [
    ...jsOrder.map((js) => <script key={js} src={manifest[js]} />),
    <script
      key="__asyncData"
      dangerouslySetInnerHTML={{
        __html: `window.__ASYNC_DATA__=${JSON.stringify(fetchData)}`,
      }}
    />,
  ];
  const injectCss: JSX.Element[] = [];

  let dynamicCssOrder = cssOrder.concat([`${webpackChunkName}.css`]);
  dynamicCssOrder.forEach((css) => {
    if (manifest[css]) {
      const item = manifest[css];
      injectCss.push(<link rel="stylesheet" key={item} href={item} />);
    }
  });

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
