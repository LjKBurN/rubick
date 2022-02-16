import { webpack } from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './config/client';
import { loadConfig } from '../server-utils';

const config = loadConfig();

const startClientServer = async (): Promise<void>  => {
  const { webpackDevServerConfig, fePort, host } = config;
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackDevServerConfig);

    compiler.hooks.done.tap('DonePlugin', () => {
      resolve()
    })
    
    server.listen(fePort, host, () => {});
  });
}

export {
  startClientServer,
}