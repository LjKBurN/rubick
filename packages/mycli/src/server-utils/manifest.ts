const getManifest = async (): Promise<Record<string, string>> => {
  let manifest = {};

  manifest = require('@dist/client/manifest.json');
  return manifest;
}

export {
  getManifest
}