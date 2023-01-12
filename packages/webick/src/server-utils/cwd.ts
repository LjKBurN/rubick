import { promises, accessSync, readFileSync, writeFileSync } from 'fs'
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

const normalizeStartPath = (path: string) => {
  if (path.startsWith('//')) {
    path = path.replace('//', '/')
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return path
}

const normalizeEndPath = (path: string) => {
  if (!path.endsWith('/')) {
    path = `${path}/`
  }
  return path
}

const accessFileSync = (file: string) => {
  let res = true
  try {
    accessSync(file)
  } catch (error) {
    res = false
  }
  return res
}

const transformConfig = () => {
  try {
    const { mkdir } = require('shelljs')
    const { transformSync } = require('esbuild')
    const cwd = getCwd()
    if (!accessFileSync(resolve(cwd, './dist'))) {
      mkdir(resolve(cwd, './dist'))
    }
    let fileContent;
    let loader;
    if (accessFileSync(resolve(cwd, './config.js'))) {
      fileContent = readFileSync(resolve(cwd, './config.js')).toString()
      loader = 'js';
    }
    if (accessFileSync(resolve(cwd, './config.ts'))) {
      fileContent = readFileSync(resolve(cwd, './config.ts')).toString()
      loader = 'ts';
    }
    const { code } = transformSync(fileContent, {
      loader,
      format: 'cjs'
    })
    writeFileSync(resolve(cwd, './dist/config.js'), code)
  } catch (error) {

  }
}

export {
  getCwd,
  getFeDir,
  getPagesDir,
  copyContextFile,
  normalizeStartPath,
  normalizeEndPath,
  transformConfig,
}
