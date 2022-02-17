const loadConfig = () => {
  const mode = 'ssr';

  const clientEntry = './node_modules/@ljkburn/mycli/esm/src/entry/client-entry.js';

  const serverEntry = './node_modules/@ljkburn/mycli/esm/src/entry/server-entry.js';

  const isDev = process.env.NODE_ENV !== 'production';

  const fePort = 8881;

  const https = false;

  const serverPort = 8010;

  const host = '0.0.0.0'

  const chunkName = 'Page';

  const jsOrder = [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`];

  const cssOrder = [`${chunkName}.css`];

  // const webpackStatsOption = {
  //   assets: true, // 添加资源信息
  //   cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  //   children: false, // 添加 children 信息
  //   chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
  //   colors: true, // 以不同颜色区分构建信息
  //   modules: false, // 添加构建模块信息
  //   warnings: false,
  //   entrypoints: false
  // }

  const webpackDevServerConfig = {
    host,
    hot: false,
    port: fePort,
    https,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  };
  
  const config = {
    mode,
    chunkName,
    clientEntry,
    serverEntry,
    isDev,
    host,
    fePort,
    https,
    serverPort,
    jsOrder,
    cssOrder,
    webpackDevServerConfig
  }

  return config;
}

export {
  loadConfig,
}