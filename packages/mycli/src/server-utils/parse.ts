import path from 'path';
import { promises as fs } from 'fs';
import { getCwd, getPagesDir } from './cwd';

const pagePath = getPagesDir();
const distPath = path.join(getCwd(), './dist');
const dynamic = true;

export interface ParseFeRouteItem {
  path: string;
  fetch?: string;
  component?: string;
  webpackChunkName: string;
}

export const parseFeRoutes = async () => {
  const pathRecord: string[] = [''];
  const arr = await renderRoutes(pagePath, pathRecord);

  arr.forEach((item) => {
    const { component, webpackChunkName, fetch } = item;
    if (component) {
      if (dynamic) {
        item.component = `function dynamicComponent () {return import(/* webpackChunkName: "${webpackChunkName}" */ '${component}')}`;
      } else {
        item.component = `require('${component}').default`;
      }
    }
    if (fetch) {
      item.fetch = `() => import(/* webpackChunkName: "${webpackChunkName}-fetch" */ '${fetch}')`;
    }
  });
  let routes = `
    export const FeRoutes = ${JSON.stringify(arr)}
  `;
  const re = /"webpackChunkName":("(.+?)")/g
  routes = routes.replace(/"component":("(.+?)",)/g, (global, m1, m2) => {
    // const currentWebpackChunkName = re.exec(routes)[2]
    // if (dynamic) {
    //   return `"component": function dynamicComponent () {
    //     return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}')
    //   }
    //   `
    // } else {
    //   return `"component": require('${m2.replace(/\^/g, '"')}').default`
    // }
    return `"component": ${m2.replace(/\\"/g, '"')},`;
  })
  re.lastIndex = 0
  routes = routes.replace(/"fetch":("(.+?)",)/g, (global, m1, m2) => {
    // const currentWebpackChunkName = re.exec(routes)[2]
    // return `"fetch": () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}')`
    return `"fetch": ${m2.replace(/\\"/g, '"')},`;
  })
  await fs.writeFile(path.resolve(distPath, './feRoutes.js'), routes)
};

const renderRoutes = async (pageDir: string, pathRecord: string[]) => {
  let arr: ParseFeRouteItem[] = [];
  const prefixPath = pathRecord.join('/');
  const aliasPath = `@client/pages${prefixPath}`;
  // @ts-expect-error
  const route: ParseFeRouteItem = {};
  const routeArr: ParseFeRouteItem[] = [];
  const pageFolders = await fs.readdir(pageDir);
  for (const pageFiles of pageFolders) {
    const abFolder = path.join(pageDir, pageFiles);
    const isDirectory = (await fs.stat(abFolder)).isDirectory()
    if (isDirectory) {
      // 是文件夹则递归 记录路径
      pathRecord.push(pageFiles);
      const childArr = await renderRoutes(abFolder, pathRecord);
      pathRecord.pop();
      arr = arr.concat(childArr);
    } else {
      // if (pageFiles.includes('render$')) {
      //   route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`;
      //   route.component = `${aliasPath}/${pageFiles}`;
      //   let webpackChunkName = pathRecord.join('-');
      //   if (webpackChunkName.startsWith('-')) {
      //     webpackChunkName = webpackChunkName.replace('-', '');
      //   }
      //   route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(pageFiles).replace(/\/:\??/g, '-').replace('?', '-optional')}`
      // }
      if (pageFiles.includes('render')) {
        route.path = `${getDynamicParam(prefixPath)}`;
        route.component = `${aliasPath}/${pageFiles}`
        let webpackChunkName = pathRecord.join('-');
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '');
        }
        route.webpackChunkName = webpackChunkName;
      }

      if (pageFiles.includes('fetch')) {
        route.fetch = `${aliasPath}/fetch.ts`;
      }

      routeArr.push({...route});
    }
  }

  routeArr.forEach((r) => {
    if (r.path?.includes('index')) {
      // /index 映射为 /
      if (r.path.split('/').length >= 3) {
        r.path = r.path.replace('/index', '');
      } else {
        r.path = r.path.replace('index', '');
      }
    }

    r.path && arr.push(r);
  })

  return arr;
}

const getDynamicParam = (url: string) => {
  // return url.split('$').filter(r => r !== 'render' && r !== '').map(r => r.replace(/\.[\s\S]+/, '').replace('#', '?')).join('/:')
  return url.split('$').map(r => r.replace(/\.[\s\S]+/, '').replace('#', '?')).join('/:')
}