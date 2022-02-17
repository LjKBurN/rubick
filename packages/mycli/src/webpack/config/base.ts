import * as path from 'path';
import { Configuration } from 'webpack';
import { getCwd } from '../../server-utils';
import { Mode } from '../../../types';

const loadModule = require.resolve

const projectRoot: string = getCwd();

const getBaseConfig = () => {
  const mode = process.env.NODE_ENV as Mode;
  const baseConfig: Configuration = {
    mode,
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        '@src': path.resolve(projectRoot, './src'),
        '@dist': path.resolve(projectRoot, './dist'),
        '@client': path.join(projectRoot, './src/client'),
        '@components': path.join(projectRoot, './src/client/components'),
        'react': loadModule('react'), 
        'react-dom': loadModule('react-dom'),
        'react-router-dom': loadModule('react-router-dom'),
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
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-transform-runtime'],
              },
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

  return baseConfig;
}

export {
  getBaseConfig
}