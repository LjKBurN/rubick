# `snest`

# description
基于 koa 实现的具有 利用装饰器路由、做为Ioc容器能力 的node框架


## Install

```
 $ yarn add snest
```

## Usage

server.ts

在提供服务的类上使用 Injectable 装饰器，该类被视为一个 Providers 提供者

```ts
import { Injectable } from 'snest';

@Injectable()
class AppService {
  hello() {
    console.log('Hello World!');
  }
}

export { AppService }
```

controller.ts

'Controller' 控制器负责处理传入的请求和向客户端返回响应

我们可以通过在构造函数中进行依赖注入，创建一个 AppService 的实例 service 并返回给构造函数

利用 Controller 和其他请求方法装饰器来实现路由的控制

ctx 就是 Koa 中的 Context

```ts
import { Controller, Get, Context } from 'snest';
import { AppService } from './service.ts';

@Controller('/api')
class AppController {
  constructor(private service: AppService) {}

  @Get('/test1')
  test1(ctx: Context) {
    ctx.body = this.service.hello();
  }

  @Get('/:id')
  test2(ctx: Context) {
    const { id } = ctx.params;
    ctx.body = `api, ${id}`;
  }
}

export { AppController }
```

index.ts

类 App 继承自 Koa，我们可以像使用 Koa 一样通过 use 方法来使用中间件，通过 listen 方法来监听端口

我们需要调用 routes 方法来注册之前写好的路由

使用 trace 的 cycleLog 方法会在项目根目录下输出一个记录路由情况的 route 文件


```ts
import App from 'snest';
import './controller.ts';

const app = new App();

app.use(async (ctx, next) => {
  next();
});
app.routes();

app.listen(8080, () => {
  app.trace.cycleLog();
});
```
