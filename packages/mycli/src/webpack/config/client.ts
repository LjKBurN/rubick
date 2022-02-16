import path from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { getCwd, loadConfig } from '../../server-utils';
import baseConfig from './base';

const projectRoot: string = getCwd();

const config = loadConfig();

const clientConfig: Configuration = {
  entry: { [`${config.chunkName}`]: '../../entry/client-entry' },
  output: {
    path: path.join(projectRoot, 'dist/client'),
    filename: 'js/[name]_[chunkhash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    clean: true,
  },
  plugins: [
    new WebpackManifestPlugin({
      publicPath: '/client/',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: (module: any) => {
            return module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('node_modules')
          },
          name: 'vendor'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ]
      },
    ],
  },
}

export default merge(baseConfig, clientConfig);