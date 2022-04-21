import { startClientBuild, startClientServer } from './client';
import { startServerBuild } from './server';

export const webpackStart = async () => {
  await Promise.all([startServerBuild(), startClientServer()]);
}

export const webpackBuild = async () => {
  await Promise.all([startServerBuild(), startClientBuild()]);
}