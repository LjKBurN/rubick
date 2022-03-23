# `Webick`

## 介绍
<br/>

一个使用React具有服务端渲染、约定式路由等功能的前端框架

<br/>

---

## 快速开始

<br/>

该框架并非纯前端框架，需要搭配 Node.js 使用

你可以使用[create-rubick-app](https://github.com/LjKBurN/rubick/tree/main/packages/create-app)来快速获取一个使用 webick 与 snest 搭建的项目来学习如何使用webick

```
$ npm init rubick-app yourprojectname
```

---

<br />

## 目录结构

<br />

```
.
├── dist # 构建产物
│   ├── client # 存放前端静态资源文件
│   ├── server # 存放 external 后的服务端 bundle
│   ├── create-context.ts # 全局context生成文件
│   └── feRoutes.js # 读取pages路径生成的路由文件
├── src # 存放服务端 Node.js 相关代码
│   ├── client # 存放前端相关代码
│   │   ├── components # 存放公共组件
│   │   ├── pages
│   │   │   ├── index # index文件夹映射为根路由 /index => /
│   │   │   │   ├── render.tsx # 页面渲染逻辑
│   │   │   │   └── fetch.ts # 获取数据
│   │   │   └── list$id # 映射路由为 /list/:id
│   │   │       ├── render.tsx
│   │   │       ├── fetch.ts
│   │   │       └── detail # 映射路由为 /list/:id/detail
│   │   │           ├── render.tsx
│   │   │           └── fetch.ts
│   │   └── layout.tsx # 页面html布局
│   └── server # 存放服务端 Node.js 相关代码
├── package.json
└── tsconfig.json
```

<br/>

---

<br/>

## 前端约定式路由

<br />

通过约定式的文件夹结构来自动生成前端路由的配置

根据 `/src/client/pages` 文件夹来解析前端路由结构，`pages` 文件夹下的每个文件夹都被视为一个页面，约定规则可以参考上一节目录结构里 `pages` 下的目录结构

而在服务端，你只需要在需要渲染页面的路由下调用 `render` 方法，将请求上下午 `ctx` 做为参数传入，之后将会返回经过服务端渲染好的`html` 结构

```ts
import { Controller, Get, Context } from '@ljkburn/snest';
import { render } from '@ljkburn/webick';

@Controller()
class Home {
  constructor() {}

  @Get()
  async index(ctx: Context) {
    ctx.body = await render(ctx);
  }
}
```

<br/>

---

<br/>

## 数据获取

<br/>

每个页面文件夹下的 `fetch.ts` 文件会做为该页面组件数据获取的入口，返回的数据会做为 `props` 传给页面组件

<br/>

### 调用时机

在服务端渲染执行的时候，将会调用 `fetch`，并将数据注入到 `window` 中，在客户端渲染的时候会复用数据。然后在客户端进行前端路由跳转的时候会调用对应页面的 `fetch`

<br/>

### 方法入参

```ts
interface RouterParams {
  path: string;
  search: string;
  params: any;
}

interface FetchParams<T> {
  routerParams: RouterParams;
  ctx?: MContext<T>;
  _isClient: boolean;
}

type FetchFunc<T = {}> = (params: FetchParams<T>) => Promise<any>;
```

<br/>


