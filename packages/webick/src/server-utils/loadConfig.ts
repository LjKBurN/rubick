import { join, resolve } from 'path';
import { getCwd, normalizeStartPath, normalizeEndPath, transformConfig } from './cwd';
import { IConfig, UserConfig } from '../../types';


const loadUserConfig = (): UserConfig => {
  let config
  try {
    config = require(resolve(getCwd(), './dist/config'))
  } catch (error) {
    transformConfig()
    config = require(resolve(getCwd(), './dist/config'))
  }
  return config.userConfig ?? config
};

const loadConfig = (): IConfig => {
  const userConfig = loadUserConfig() || {};
  const cwd = getCwd();

  const mode = 'ssr';

  const isDev = userConfig.isDev ?? process.env.NODE_ENV !== 'production';

  const isVite = process.env.BUILD_TOOL === 'vite';

  const clientEntry = join(cwd, './node_modules/webick/esm/src/entry/client-entry.js');
  const clientOutput = join(cwd, './dist/client');

  const serverEntry = join(cwd, './node_modules/webick/esm/src/entry/server-entry.js');
  const serverOutput = join(cwd, './dist/server');

  const publicPath = userConfig.publicPath?.startsWith('http') ? userConfig.publicPath : normalizeStartPath(userConfig.publicPath ?? '/');
  const devPublicPath = publicPath.startsWith('http') ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '') : publicPath;

  const outputPublicPath = isDev ? devPublicPath : `${devPublicPath}client/`;

  // webpack-dev-server的端口号
  const fePort = userConfig.fePort ?? 8881;

  const https = userConfig.https ?? false;

  const serverPort = 8010;

  const host = '0.0.0.0'

  const chunkName = 'Page';

  const jsOrder = [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`];

  const cssOrder = [`${chunkName}.css`];

  const manifestPath = `${normalizeEndPath(devPublicPath)}manifest.json`
  const staticPath = `${normalizeEndPath(devPublicPath)}static`
  const hotUpdatePath = `${normalizeEndPath(devPublicPath)}*.hot-update**`

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
      directory: join(cwd, './dist'),
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
    isVite,
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
    css: userConfig?.css || {},
  }

  return config;
}

export {
  loadConfig,
  loadUserConfig,
}