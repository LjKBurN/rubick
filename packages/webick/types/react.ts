import { ReactChild } from 'react'

export type IProps<T={}> = T & {
  children: ReactChild
}

export interface Action {
  type: string
  payload: object
}

export interface IContext<T = any> {
  state?: T;
  dispatch?: React.Dispatch<Action>;
}