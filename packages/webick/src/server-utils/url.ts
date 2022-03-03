import { Context } from 'koa';
import { RouterParams } from '../../types';

export const parseUrl = (ctx: Context): RouterParams => {
  const URL = ctx.URL;
  const params = ctx.params;
  return {
    path: URL.pathname,
    search: URL.search,
    params,
  };
};
