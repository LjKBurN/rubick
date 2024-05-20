import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import * as ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import { loadConfig } from '../../server-utils';
import { getBaseConfig } from './base';

const WebpackBarPlugin = require('webpackbar');

const getClientConfig = () => {
  const { chunkName, clientEntry, clientOutput, outputPublicPath, isDev, fePort, userWebpack } = loadConfig();
  const clientConfig: Configuration = {
    entry: { [`${chunkName}`]: clientEntry },
    devtool: isDev ? 'cheap-module-source-map' : false,
    output: {
      path: clientOutput,
      publicPath: outputPublicPath,
      filename:  isDev ? 'static/js/[name].js' : 'static/js/[name].[chunkhash:8].js',
      chunkFilename:  isDev ? 'static/js/[name].chunk.js' : 'static/js/[name].[contenthash:8].chunk.js',
      clean: true,
    },
    plugins: [
      new ReactRefreshPlugin({
        overlay: { sockPort: fePort },
      }),
      new WebpackManifestPlugin({}),
      new WebpackBarPlugin({
        name: 'client',
        color: '#45b97c',
      }),
    ],
    optimization: {
      runtimeChunk: true,
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
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
          }
        })
      ],
    },
  }
  const config = merge(getBaseConfig(true), clientConfig);
  if(userWebpack){
    if( typeof userWebpack === 'function'){
      return userWebpack(config, {isClient: true});
    }else{
      throw new Error('userWebpack应该为函数');
    }
  }else{
    return config;
  }
  
}

export {
  getClientConfig
}