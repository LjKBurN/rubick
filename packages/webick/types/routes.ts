import { Location, Params } from 'react-router-dom';
import { Context } from 'koa';

export interface FetchParams {
  routerParams?: {
    location: Location,
    params: Params,
  }
  ctx?: Context,
  _isClient: boolean,
}

export type FetchFunc<T={}, U={}> = (params: FetchParams) => Promise<any>

export type ESMFetchFunc = () => Promise<{
  default: FetchFunc
}>

export interface StaticFC<T={}> extends React.FC<T> {
  fetch?: ESMFetchFunc
  layoutFetch?: FetchFunc
}

export interface DynamicFC<T={}> extends React.FC<T>{
  (): Promise<{
    default: StaticFC<T>
  }>
  name: 'dynamicComponent'
  fetch?: ESMFetchFunc
  layoutFetch?: FetchFunc
}

export type RouteItem<T={}, U={}> = {
  path: string;
  fetch?: ESMFetchFunc
  component: DynamicFC<T>
  webpackChunkName: string
} & U