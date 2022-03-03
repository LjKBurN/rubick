export interface IWindow extends Window {
  __USE_SSR__?: boolean;
  __USE_VITE__?: boolean;
  __ASYNC_DATA__?: any;
}
