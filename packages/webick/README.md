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
