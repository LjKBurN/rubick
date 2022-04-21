#!/usr/bin/env node
import * as yargs from 'yargs';
import { resolve } from 'path';
import { fork, exec } from 'child_process';
import { rm, mkdir } from 'shelljs';
import { parseFeRoutes, copyContextFile, getCwd, loadConfig, transformConfig } from './server-utils';
import { webpackBuild, webpackStart } from './webpack';

const cwd = getCwd();

const spinnerProcess = fork(resolve(__dirname, './spinner'));

const spinner = {
  start: () =>
    spinnerProcess.send({
      message: 'start',
    }),
  stop: () =>
    spinnerProcess.send({
      message: 'stop',
    }),
};

yargs
  .command('start', 'Start Server', {}, async (argv) => {
    spinner.start();
    process.env.NODE_ENV = 'development';
    process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack';

    rm('-rf', resolve(cwd, './dist'));
    mkdir(resolve(cwd, './dist'));
    transformConfig();
    await parseFeRoutes();
    await copyContextFile();

    spinner.stop();

    const { isVite } = loadConfig();
    if (isVite) {
      // no action
    } else {
      await webpackStart();
    }
  
    const { stdout, stderr } = exec('yarn run dev', {
      env: { ...process.env },
    });
    stdout?.on('data', (data) => {
      console.log(data);
    });
    stderr?.on('data', (data) => {
      console.error(`error: ${data}`);
    });
  })
  .command('build', 'Build files', {}, async (argv) => {
    spinner.start();
    process.env.NODE_ENV = 'production';

    rm('-rf', resolve(cwd, './dist'));
    mkdir(resolve(cwd, './dist'));
    await parseFeRoutes();
    await copyContextFile();

    spinner.stop();

    await webpackBuild();
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .fail((msg, err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log(msg);
  })
  .parse();
