import { resolve } from 'path';
import { getCwd, loadConfig } from '../server-utils';
import { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createStyleImportPlugin, AntdResolve } from 'ssr-vite-plugin-style-import';

const cwd = getCwd();

const commonConfig = (): UserConfig => {
  const { css } = loadConfig();
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
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    },
    plugins: [
      react(),
      createStyleImportPlugin({
        resolves: [AntdResolve()],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          ...css?.loaderOptions?.less,
        },
      },
    },
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