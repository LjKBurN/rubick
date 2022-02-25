import App from '@ljkburn/snest';
import path from 'path';
import koaStatic from 'koa-static';
import { initDevProxy, getCwd } from '@ljkburn/mycli';
import './controller/home.controller';
import './controller/api.controller';

const staticPath = path.join(process.cwd(), './dist');

async function start() {
  process.env.NODE_ENV = 'development';
  const app = new App();

  app.routes();

  await initDevProxy(app);
  app.use(koaStatic(staticPath));

  app.listen(8080, () => {
    console.log('the server is running at http://localhost:8080');
    app.trace.cycleLog();
  });
}

start();
