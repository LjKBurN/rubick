import path from 'path';
import webpack, { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import { getCwd, loadConfig } from '../../server-utils';
import baseConfig from './base';

const projectRoot: string = getCwd();

const config = loadConfig();

const serverConfig: Configuration = {
  devtool: 'inline-source-map',
  target: 'node',
  entry: { [`${config.chunkName}`]: '../../entry/server-entry' },
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

export default merge(baseConfig, serverConfig);