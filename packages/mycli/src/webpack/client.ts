import { webpack } from "webpack";
import * as WebpackDevServer from 'webpack-dev-server';
import { webpackPromisify } from './utils/promisify';
import { getClientConfig } from './config/client';
import { loadConfig } from '../server-utils';

const config = loadConfig();

const startClientServer = async (): Promise<void>  => {
  const { webpackDevServerConfig, fePort, host } = config;
  return await new Promise((resolve) => {
    const compiler = webpack(getClientConfig());
    const server = new WebpackDevServer(compiler, webpackDevServerConfig);

    compiler.hooks.done.tap('DonePlugin', () => {
      resolve()
    })
    
    server.listen(fePort, host, () => {});
  });
}

const startClientBuild = async () => {
  await webpackPromisify(getClientConfig());
  console.log('client build done')
}

export {
  startClientServer,
  startClientBuild,
}