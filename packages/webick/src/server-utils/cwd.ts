import { promises } from 'fs'
import { resolve } from 'path'

const getCwd = () => {
  return process.cwd();
}

const getFeDir = () => {
  return resolve(getCwd(), './src/client')
}

const getPagesDir = () => {
  return resolve(getFeDir(), 'pages')
}

const copyContextFile = async () => {
  await promises.copyFile(
    resolve(getCwd(),'./node_modules/@ljkburn/webick/src/entry/create-context.ts'),
    resolve(getCwd(), './dist/create-context.ts')
  );
}

export {
  getCwd,
  getFeDir,
  getPagesDir,
  copyContextFile,
}
