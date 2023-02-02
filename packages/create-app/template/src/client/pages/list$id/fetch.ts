import { FetchFunc } from 'webick';
import axios from 'axios';

const Fetch: FetchFunc = async ({ routerParams, _isClient, ctx }) => {
  console.log(routerParams);
  const res = (await axios.get('http://localhost:8080/api/index')).data;
  return {
    data: res,
    id: routerParams.params.id,
  };
};

export default Fetch
