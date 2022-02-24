import { join } from 'path'
import { getCwd } from './cwd';
import axios from 'axios';
import { loadConfig } from './loadConfig';

const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const getManifest = async (): Promise<Record<string, string>> => {
  const { isDev, fePort, https, manifestPath } = loadConfig();
  let manifest = {};
  if (isDev) {
    const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`);
    manifest = res.data;
  } else {
    // @ts-expect-error
    const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    manifest = requireFunc(join(getCwd(), './dist/client/manifest.json'));
  }
  return manifest;
}

export {
  getManifest
}