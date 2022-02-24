import { webpackPromisify } from './utils/promisify';
import { getServerConfig } from './config/server';
import { loadConfig } from '../server-utils';

const config = loadConfig();

const startServerBuild = async () => {
  const { webpackStatsOption } = config;
  const stats = await webpackPromisify(getServerConfig());
  console.log('server build done\n', stats?.toString(webpackStatsOption));
};

export {
  startServerBuild,
}