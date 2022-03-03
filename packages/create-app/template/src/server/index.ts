import App from '@ljkburn/snest';
import path from 'path';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';
import { initDevProxy, getCwd } from '@ljkburn/webick';
import './controller';

const staticPath = path.join(process.cwd(), './dist');

async function start() {
  process.env.NODE_ENV = 'development';
  const app = new App();

  // koa-body中间件需在注册路由前使用
  app.use(koaBody());

  app.routes();

  // 在开发环境时会代理资源请求到webpack-dev-server
  await initDevProxy(app);
  app.use(koaStatic(staticPath));

  app.listen(8080, () => {
    console.log('the server is running at http://localhost:8080');
    app.trace.cycleLog();
  });
}

start();
