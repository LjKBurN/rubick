import { Context } from 'koa';

export interface RouterParams {
  path: string;
  search: string;
  params: any;
}

export type MContext<T = {}> = Context & T;

export interface FetchParams<T> {
  routerParams: RouterParams;
  ctx?: MContext<T>;
  _isClient: boolean;
}

export type FetchFunc<T = {}> = (params: FetchParams<T>) => Promise<any>;

export type ESMFetchFunc = () => Promise<{
  default: FetchFunc;
}>;

export interface StaticFC<T = {}> extends React.FC<T> {
  fetch?: ESMFetchFunc;
  layoutFetch?: FetchFunc;
}

export interface DynamicFC<T = {}> extends React.FC<T> {
  (): Promise<{
    default: StaticFC<T>;
  }>;
  name: 'dynamicComponent';
  fetch?: ESMFetchFunc;
  layoutFetch?: FetchFunc;
}

export type RouteItem<T = {}, U = {}> = {
  path: string;
  fetch?: ESMFetchFunc;
  component: DynamicFC<T>;
  webpackChunkName: string;
} & U;

export interface RoutesType {
  layoutFetch?: FetchFunc;
  FeRoutes: RouteItem[];
}
