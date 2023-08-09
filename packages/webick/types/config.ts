export interface proxyOptions {
  express?: boolean;
}

export interface IConfig {
  mode: 'ssr' | 'csr';
  isVite: boolean;
  stream: boolean;
  chunkName: string;
  clientEntry: string;
  clientOutput: string;
  serverEntry: string;
  serverOutput: string;
  isDev: any;
  host: string;
  fePort: number;
  https: any;
  serverPort: number;
  jsOrder: string[],
  cssOrder: string[],
  devPublicPath: string,
  outputPublicPath: string,
  manifestPath: string,
  proxyKey: string[],
  webpackDevServerConfig?: any,
  webpackStatsOption: any,
  css?: {
    loaderOptions?: {
      cssOptions?: any;
      less?: any;
    }
  }
}

export interface UserConfig {
  mode?: 'ssr' | 'csr';
  stream?: boolean;
  isDev?: boolean;
  https?: boolean;
  fePort?: number;
  publicPath?: string;
  css?: {
    loaderOptions?: {
      cssOptions?: any;
      less?: any;
    }
  }
}

export interface RenderConfig {
  mode?: 'ssr' | 'csr';
  stream?: boolean;
}