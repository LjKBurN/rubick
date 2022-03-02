// @ts-nocheck
import { pathToRegexp } from 'path-to-regexp';

function findRoute<T extends {path: string}> (Routes: T[], path: string): T {
  const route = Routes.find(route => {
    const regexp = pathToRegexp(route.path);
    return regexp.test(path);
  });
  return route;
}

export {
  findRoute
}