import React, { useContext } from 'react';
import { STORE_CONTEXT } from '@dist/create-context';
import { IContext } from 'webick';
import './index.css';

function Search() {
  const { state, dispatch} = useContext<IContext>(STORE_CONTEXT);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch?.({
      type: 'updateContext',
      payload: {
        search: {
          text: e.target.value
        }
      }
    })
  }
  return (
    <div className='searchContainer'>
      {/* 这里需要给 value 一个兜底的状态 否则 context 改变 首次 render 的 text 值为 undefined 会导致 input 组件 unmount */}
      <input type="text" value={state?.search?.text ?? ''} className="input" onChange={handleChange} placeholder="该搜索框内容会在所有页面共享" />
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className="searchImg" />
    </div >
  )
}

export default Search