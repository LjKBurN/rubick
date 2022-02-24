import { createProxyMiddleware } from 'http-proxy-middleware';
// @ts-expect-error
import * as koaConnect from 'koa2-connect';
import { loadConfig } from './loadConfig';
import { proxyOptions } from '../../types';

const initDevProxy = async (app: any, options?: proxyOptions) => {
  const proxyMiddlewares = await getDevProxyMiddlewares(options)
  for (const middleware of proxyMiddlewares) {
    app.use(middleware)
  }
}

const kc = koaConnect.default || koaConnect;

const getDevProxyMiddlewares = async (options?: proxyOptions) => {
  const { isDev, proxyKey, https, fePort } = loadConfig();
  const express = options ? options.express : false;
  const proxyMiddlewaresArr: any[] = [];
  
  function registerProxy (proxy: any) {
    for (const path in proxy) {
      const options = proxy[path];
      const middleware = express ? createProxyMiddleware(path, options) : kc(createProxyMiddleware(path, options));
      proxyMiddlewaresArr.push(middleware);
    }
  }

  if (isDev) {
    const remoteStaticServerOptions = {
      target: `${https ? 'https' : 'http'}://127.0.0.1:${fePort}`,
      changeOrigin: true,
      secure: false,
      logLevel: 'warn'
    }
    const proxyPathMap: Record<string, any> = {};

    for (const key of proxyKey) {
      proxyPathMap[key] = remoteStaticServerOptions;
    }
    registerProxy(proxyPathMap)
  }
  return proxyMiddlewaresArr;
}

export {
  initDevProxy,
  getDevProxyMiddlewares,
}