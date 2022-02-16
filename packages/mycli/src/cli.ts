#!/usr/bin/env node
import * as yargs from 'yargs';
import { parseFeRoutes, copyContextFile } from './server-utils';
import { startClientServer } from './webpack/client';
import { startServerBuild } from './webpack/server';

yargs.command('start', 'Start Server', {}, async (argv) => {
  console.log('start server', argv);
  process.env.NODE_ENV = 'development';
  await parseFeRoutes();
  await copyContextFile();
  await Promise.all([startServerBuild(), startClientServer()]);
})