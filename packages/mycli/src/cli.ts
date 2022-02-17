#!/usr/bin/env node
import * as yargs from 'yargs';
import { parseFeRoutes, copyContextFile } from './server-utils';
import { startClientBuild } from './webpack/client';
import { startServerBuild } from './webpack/server';

yargs
  .command('start', 'Start Server', {}, async (argv) => {
    process.env.NODE_ENV = 'development';
    await parseFeRoutes();
    await copyContextFile();
    await Promise.all([startServerBuild(), startClientBuild()]);
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log(msg)
  })
  .parse()