import { resolve } from 'path';
import { getCwd } from '../server-utils';
import { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

const cwd = getCwd();

const commonConfig = (): UserConfig => {
  return {
    root: cwd,
    mode: 'development',
    server: {
      middlewareMode: 'ssr',
    },
    resolve: {
      alias: {
        '@src': resolve(cwd, './src'),
        '@dist': resolve(cwd, './dist'),
        '@client': resolve(cwd, './src/client'),
        '@components': resolve(cwd, './src/client/components'),
      },
      extensions: ['.mjs', '.ts', '.jsx', '.tsx', '.json', '.js'],
    },
    plugins: [
      react()
    ],
  }
}

const serverConfig = (): UserConfig => {
  return {
    ...commonConfig(),
  }
}

const clientConfig = (): UserConfig => {
  return {
    ...commonConfig(),
    esbuild: {
      keepNames: true,
    }
  }
}

export {
  serverConfig,
  clientConfig,
}