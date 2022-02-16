import path from 'path';
import ReactDOM from 'react-dom/server'
import { Context } from 'koa';
import { getCwd, loadConfig } from '../server-utils';

const cwd = getCwd();
const config = loadConfig();

async function render(ctx: Context) {
  const { isDev, chunkName } = config;

  const serverFile = path.resolve(cwd, `./dist/server/${chunkName}.server.js`);

  if (isDev) {
    delete require.cache[serverFile]
  }

  const { serverRender } = require(serverFile);
  const res = await serverRender(ctx);
  ctx.body = ReactDOM.renderToString(res);
}

export {
  render
}