import path from 'path';
import { Configuration } from 'webpack';
import { getCwd } from '../../server-utils';
import { Mode } from '../../../types';

const projectRoot: string = getCwd();

const baseConfig: Configuration = {
  mode: process.env.NODE_ENV as Mode,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    alias: {
      '@src': path.resolve(projectRoot, './src'),
      '@dist': path.resolve(projectRoot, './dist'),
      '@client': path.join(projectRoot, './src/client'),
      '@components': path.join(projectRoot, './src/client/components'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx|\.ts|\.jsx|\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /.css$/,
        use: [
          {
            loader: 'css-loader',
          },
        ]
      },
    ],
  },
}

export default baseConfig;