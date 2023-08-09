import * as path from 'path';
import { PassThrough, Readable } from 'stream';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { Context } from 'koa';
import type { ViteDevServer } from 'vite';
import { getCwd, loadConfig } from '../server-utils';
import { serverConfig as viteConfig } from '../vite';
import { RenderConfig, IConfig } from '../../types';

const cwd = getCwd();
const defaultConfig = loadConfig();

function render(ctx: Context, options?: RenderConfig & { stream: true }): Promise<PassThrough>
function render(ctx: Context, options?: RenderConfig & { stream: false }): Promise<string>

async function render(ctx: Context, options?: RenderConfig) {
  const config = Object.assign(defaultConfig, options ?? {});
  const { isDev, isVite, stream } = config;
  const res = isVite && isDev ? await viteRender(ctx, config) : await commonRender(ctx, config);

  ctx.response.type = 'text/html;charset=utf-8';

  if (stream) {
    return renderToNodeStream(res);
  } else {
    return `<!DOCTYPE html>${renderToString(res)}`;
  }
}

let viteServer: ViteDevServer|boolean = false;
async function viteRender(ctx: Context, config: IConfig) {
  const { serverEntry } = config;
  const { createServer } = await import('vite');
  viteServer = !viteServer ? await createServer(viteConfig()) : viteServer;
  const { serverRender } = await (viteServer as ViteDevServer).ssrLoadModule(serverEntry);
  const res = await serverRender(ctx, config);
  return res;
}

async function commonRender(ctx: Context, config: IConfig) {
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
