export interface proxyOptions {
  express?: boolean;
}

export interface IConfig {
  mode: string;
  isVite: boolean;
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
}

export interface UserConfig {
  mode?: string;
  isDev?: boolean;
  https?: boolean;
  fePort?: number;
  publicPath?: string;
}