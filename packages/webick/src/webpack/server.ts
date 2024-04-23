import { webpackPromisify } from './utils/promisify';
import { getServerConfig } from './config/server';
import { loadConfig } from '../server-utils';

const config = loadConfig();

const startServerBuild = async () => {
  const { webpackStatsOption } = config;
  const stats = await webpackPromisify(getServerConfig());
  if(!stats || stats.hasErrors()){
    console.log(stats?.toString(webpackStatsOption));
    process.exit(1);
  }
  console.log('server build done\n', stats?.toString(webpackStatsOption));
};

export {
  startServerBuild,
}