import * as path from 'path';
import { Configuration } from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getCwd, loadConfig } from '../../server-utils';
import { Mode } from '../../../types';

const loadModule = require.resolve

const projectRoot: string = getCwd();

const getBaseConfig = (isClient: boolean = false) => {
  const { isDev, css } = loadConfig();
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
    resolveLoader: {
      modules: ['node_modules', 'node_modules/webick/node_modules'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDev ? 'static/css/[name].css' : 'static/css/[name].[contenthash:8].css',
        chunkFilename: isDev ? 'static/css/[name].chunk.css' : 'static/css/[name].[contenthash:8].chunk.css',
      }),
    ],
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
                plugins: [
                  '@babel/plugin-transform-runtime',
                  [
                    'babel-plugin-import',
                    {
                      libraryName: 'antd',
                      libraryDirectory: 'lib',
                      style: true,
                    }, 'antd'
                  ],
                  isClient && isDev && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: isClient,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: { auto: true },
                importLoaders: 1,
              },
            },
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: isClient,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: { auto: true },
                importLoaders: 1,
                ...css?.loaderOptions?.cssOptions,
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  ...css?.loaderOptions?.less,
                },
              },
            }
          ]
        },
        {
          test: /.(png|svg|jpg|gif|jpeg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/image/[name]_[hash:8][ext][query]',
          },
        }
      ],
    },
  }

  return baseConfig;
}

export {
  getBaseConfig
}