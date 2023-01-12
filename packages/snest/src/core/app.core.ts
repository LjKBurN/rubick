import Koa, { DefaultContext, DefaultState } from 'koa';
import 'reflect-metadata';
import Router from 'koa-router';
import fs from 'fs';
import {
  ControllerToRouterMapper,
  HttpMethod,
  IConstructor,
} from '../controller/mapper.router';
import { MiddleWareFunction, MiddleWare } from '../middleware';
import { injectableClassSet } from '../injector';
import { Trace } from '../trace';

class AppCore extends Koa {
  router = new Router();
  controllerToMiddlewareMapping = new Map<
    IConstructor,
    IControllerMiddleWare[]
  >();

  trace = new Trace();

  constructor() {
    super();
  }

  use<NewStateT = {}, NewCustomT = {}>(
    middleware: Koa.Middleware<NewStateT, NewCustomT>,
  ): Koa<NewStateT & DefaultState, NewCustomT & DefaultContext> {
    this.trace.setNode('middle', middleware.name);
    return super.use(
      async function (ctx, next) {
        await middleware(ctx, next);
      }
    );
  }

  routeMapping(mapper: ControllerToRouterMapper) {
    const { mapping } = mapper;
    for (let [Controller, controllerRouter] of mapping) {
      const controller = DependenceFactory.create<{
        [method: string]: Function;
      }>(Controller);
      const { prefix = '', subRoutes } = controllerRouter;
      for (let i = 0; i < subRoutes.length; i += 1) {
        const { method, pathRule, handler } = subRoutes[i];
        const rule = `/${prefix}/${pathRule}`.replace(/\/+/g, '/');
        this.trace.setNode('ctor', Controller.name, handler, rule, method);
        this.router[method](rule, async (ctx, next) => {
          await controller[handler](ctx);
          await next();
        });
      }
    }
  }

  useForRoutes(rule: string, middleware: MiddleWareFunction, method?: HttpMethod ) {
    this.trace.setNode('route_middle', middleware.name);
    if (method) {
      this.router[method](rule, middleware);
    } else {
      this.router.use(rule, middleware);
    }
  }

  // cycleLog() {
  //   let cur = this.rootNode;
  //   let str = '请求/响应循环：';
  //   while (cur.next) {
  //     cur = cur.next;
  //     const { type, info } = cur;
  //     if (type === "路由中间件") {
  //       str += `\n\t[${cur.type}: ${cur.info()}]---->${this.routeNode.linkBundleRoot.allThrough()}`;
  //     } else {
  //       str += `\n\t[${cur.type}: ${cur.info()}]`;
  //     }
  //   }
  //   const writeStream = fs.createWriteStream('./route', 'utf-8');
  //   writeStream.write(str);
  // }
}

interface IControllerMiddleWare {
  useFn: MiddleWareFunction;
  method?: HttpMethod;
  name: string;
}

interface IPathParams {
  path: string;
  method: HttpMethod;
}

class DependenceFactory {
  static create<T>(Constructor: { new (...args: any[]): T }): T {
    const paramsTypes: Array<IConstructor> = Reflect.getMetadata(
      'design:paramtypes',
      Constructor,
    );
    const paramInstances =
      paramsTypes?.map((v, i) => {
        if (!injectableClassSet.has(v)) {
          throw new Error(`类${v.name}不可注入`);
        } else if (v?.length) {
          return DependenceFactory.create(v); // 递归构造
        } else {
          return new v();
        }
      }) || [];

    return new Constructor(...paramInstances);
  }
}

class Dependence<T> {
  parent: Dependence<T> | null = null;
  children: Dependence<T>[] | null = null;
  ctor: { new (...args: any[]): T } | null = null;

  setCtor(ctor: { new (...args: any[]): T }) {
    this.ctor = ctor;
  }

  setParent(p: Dependence<T>) {
    this.parent = p;
  }

  pushChild(c: Dependence<T>) {
    this.children?.push(c);
  }
}

export default AppCore;
