import { webpackPromisify } from './utils/promisify';
import { getServerConfig } from './config/server';

const startServerBuild = async () => {
  await webpackPromisify(getServerConfig());
};

export {
  startServerBuild,
}