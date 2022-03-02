import { webpack } from "webpack";
import * as WebpackDevServer from 'webpack-dev-server';
import { webpackPromisify } from './utils/promisify';
import { getClientConfig } from './config/client';
import { loadConfig } from '../server-utils';

const config = loadConfig();

const startClientServer = async (): Promise<void>  => {
  const { webpackDevServerConfig } = config;
  return await new Promise((resolve) => {
    const compiler = webpack(getClientConfig());
    const server = new WebpackDevServer(webpackDevServerConfig, compiler);

    compiler.hooks.done.tap('DonePlugin', () => {
      resolve()
    })
    
    server.start();
  });
}

const startClientBuild = async () => {
  const { webpackStatsOption } = config;
  const stats = await webpackPromisify(getClientConfig());
  console.log('client build done\n', stats?.toString(webpackStatsOption));
}

export {
  startClientServer,
  startClientBuild,
}