import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import * as nodeExternals from 'webpack-node-externals';
import { loadConfig } from '../../server-utils';
import { getBaseConfig } from './base';

const WebpackBarPlugin = require('webpackbar');

const getServerConfig = () => {
  const { isDev, chunkName, serverEntry, serverOutput } = loadConfig();
  const serverConfig: webpack.Configuration = {
    watch: isDev,
    devtool: isDev ? 'inline-source-map' : false,
    target: 'node',
    entry: { [`${chunkName}`]: serverEntry },
    output: {
      path: serverOutput,
      filename: '[name].server.js',
      libraryTarget: 'commonjs',
      clean: true,
    },
    externalsPresets: { node: true },
    externals: [
      nodeExternals(),
      'vite',
      'esbuild',
    ],
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new WebpackBarPlugin({
        name: 'server',
        color: '#f173ac',
      }),
    ],
  }

  return merge(getBaseConfig(), serverConfig);
}

export {
  getServerConfig
}