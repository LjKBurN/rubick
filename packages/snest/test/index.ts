import App, { MiddleWare, Context, Next } from '../src';
import './controllers';

const app = new App();

app.routes();

app.listen(8001, () => {
  console.log(`server start at http://localhost:8001`);
  app.trace.cycleLog();
});