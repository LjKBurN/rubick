import { FetchFunc } from 'webick';
import axios from 'axios';

const Fetch: FetchFunc<{
  apiService: {
    index: () => Promise<string>,
    detail: (id: string) => Promise<string>,
  }
}> = async ({ routerParams, _isClient, ctx }) => {
  const { id } = routerParams.params;
  let res;
  if (_isClient) {
    res = (await axios.post('http://localhost:8080/api/detail', { id })).data;
  } else {
    res = await ctx.apiService.detail(id);
  }
  return {
    data: res,
    id,
  };
};

export default Fetch