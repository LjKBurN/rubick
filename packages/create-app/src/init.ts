import * as fs from 'fs';
import { join } from 'path';
import * as yargs from 'yargs';
import * as shell from 'shelljs';

const logGreen = (text: string) => {
  console.log(`\x1B[32m ${text}`)
}
const logRed = (text: string) => {
  console.log(`\x1B[31m ${text}`)
}

yargs
  .command('init [projectName]', 'init a new project', {}, (argv) => {
    const cwd = process.cwd();
    let projectName;``
    if (argv.projectName) {
      projectName = argv.projectName as string;
    } else {
      logRed('未指定项目名称');
      return;
    }

    if (fs.existsSync(projectName)) {
      logRed(`${projectName} already existed, please delete it`);
      return;
    }

    shell.cp('-r', `${join(__dirname, `../template`)}`, `${join(cwd, `./${projectName}`)}`);

    logGreen(`${projectName} has created succeed `)

    console.log(`  cd ${projectName}`)
    console.log('  npm install (or `yarn`)')
    console.log('  npm start (or `yarn start`)')
  })
  .argv