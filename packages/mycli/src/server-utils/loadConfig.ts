import { join } from 'path';
import { getCwd } from './cwd';

const loadConfig = () => {
  const cwd = getCwd();

  const mode = 'ssr';

  const isDev = process.env.NODE_ENV !== 'production';

  const clientEntry = join(cwd, './node_modules/@ljkburn/mycli/esm/src/entry/client-entry.js');
  const clientOutput = join(cwd, './dist/client');

  const serverEntry = join(cwd, './node_modules/@ljkburn/mycli/esm/src/entry/server-entry.js');
  const serverOutput = join(cwd, './dist/server');

  const devPublicPath = '/';

  const outputPublicPath = isDev ? devPublicPath : `${devPublicPath}client/`;

  const fePort = 8881;

  const https = false;

  const serverPort = 8010;

  const host = '0.0.0.0'

  const chunkName = 'Page';

  const jsOrder = [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`];

  const cssOrder = [`${chunkName}.css`];

  const manifestPath = '/manifest.json';
  const staticPath = '/static';
  const hotUpdatePath = `/*.hot-update**`;

  const proxyKey = [manifestPath, staticPath, hotUpdatePath];

  const webpackStatsOption = {
    assets: true, // 添加资源信息
    cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 仅展示被生成的文件 (并非被构建的模块) ）
    children: false, // 添加 children 信息
    chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    colors: true, // 以不同颜色区分构建信息
    modules: false, // 添加构建模块信息
    warnings: false,
    entrypoints: false
  }

  const webpackDevServerConfig = {
    host,
    hot: true,
    static: {
      directory: './dist',
      publicPath: devPublicPath,
    },
    port: fePort,
    https,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    devMiddleware: {
      stats: webpackStatsOption
    },
  };
  
  const config = {
    mode,
    chunkName,
    clientEntry,
    clientOutput,
    serverEntry,
    serverOutput,
    isDev,
    host,
    fePort,
    https,
    serverPort,
    jsOrder,
    cssOrder,
    devPublicPath,
    outputPublicPath,
    manifestPath,
    proxyKey,
    webpackDevServerConfig,
    webpackStatsOption,
  }

  return config;
}

export {
  loadConfig,
}