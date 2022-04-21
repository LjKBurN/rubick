import * as path from 'path';
import { renderToString } from 'react-dom/server';
import { Context } from 'koa';
import type { ViteDevServer } from 'vite';
import { getCwd, loadConfig } from '../server-utils';
import { serverConfig as viteConfig } from '../vite';

const cwd = getCwd();
const config = loadConfig();

async function render(ctx: Context) {
  const { isDev, isVite } = config;
  const res = isVite && isDev ? await viteRender(ctx) : await commonRender(ctx);
  return `<!DOCTYPE html>${renderToString(res)}`;
}

let viteServer: ViteDevServer|boolean = false;
async function viteRender(ctx: Context) {
  const { serverEntry } = config;
  const { createServer } = await import('vite');
  viteServer = !viteServer ? await createServer(viteConfig()) : viteServer;
  const { serverRender } = await (viteServer as ViteDevServer).ssrLoadModule(serverEntry);
  const res = await serverRender(ctx, config);
  return res;
}

async function commonRender(ctx: Context) {
  const { isDev, chunkName } = config;

  const serverFile = path.resolve(cwd, `./dist/server/${chunkName}.server.js`);

  if (isDev) {
    delete require.cache[serverFile];
  }

  const { serverRender } = require(serverFile);
  const res = await serverRender(ctx, config);
  return res;
}

export { render };
