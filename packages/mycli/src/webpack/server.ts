import { webpackPromisify } from './utils/promisify';
import ServerConfig from './config/server';

const startServerBuild = async () => {
  await webpackPromisify(ServerConfig);
};

export {
  startServerBuild,
}