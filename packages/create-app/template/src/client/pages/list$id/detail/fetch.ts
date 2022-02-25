import { FetchFunc } from '@ljkburn/mycli';

const Fetch: FetchFunc = async ({ routerParams, _isClient }) => {
  console.log('list', routerParams);
  const res = _isClient ? await (await fetch('/api/index')).json() : {};
  return res;
};

export default Fetch