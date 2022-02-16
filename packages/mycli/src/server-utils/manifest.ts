import path from 'path';

const getManifest = async (): Promise<Record<string, string>> => {

  let manifest = {};

  manifest = require(path.join(process.cwd(), './dist/client/manifest.json'));

  return manifest;
}

export {
  getManifest
}