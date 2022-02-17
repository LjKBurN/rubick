import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import * as nodeExternals from 'webpack-node-externals';
import { getCwd, loadConfig } from '../../server-utils';
import { getBaseConfig } from './base';

const projectRoot: string = getCwd();

const getServerConfig = () => {
  const { chunkName, serverEntry } = loadConfig();
  const serverConfig: webpack.Configuration = {
    watch: true,
    devtool: 'inline-source-map',
    target: 'node',
    entry: { [`${chunkName}`]: serverEntry },
    output: {
      path: path.join(projectRoot, 'dist/server'),
      filename: '[name].server.js',
      libraryTarget: 'commonjs',
      clean: true,
    },
    externals: [nodeExternals()],
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  }

  return merge(getBaseConfig(), serverConfig);
}

export {
  getServerConfig
}