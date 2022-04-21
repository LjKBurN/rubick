import { join } from 'path'
import { getCwd } from './cwd';
import axios from 'axios';
import { IConfig} from '../../types';

const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const getManifest = async (config: IConfig): Promise<Record<string, string>> => {
  const { isDev, isVite, fePort, https, manifestPath } = config;
  let manifest = {};
  if (isDev) {
    if (!isVite) {
      console.log(`${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`);
      const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`);
      manifest = res.data;
    }
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