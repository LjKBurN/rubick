import { FetchFunc } from '@ljkburn/mycli';
import axios from 'axios';

const Fetch: FetchFunc = async ({ routerParams, _isClient, ctx }) => {
  console.log('list fetch')
  const res = _isClient ? (await axios.get('/api/index')).data : {};
  if (!_isClient) {
    console.log('ctx', ctx.query);

  } else {
    console.log(routerParams);
    console.log('list res', res);
  }
  return res;
};

export default Fetch
