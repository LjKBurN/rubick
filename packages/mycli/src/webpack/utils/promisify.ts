import { promisify } from 'util'
import * as webpack from 'webpack'

const webpackPromisify = promisify<webpack.Configuration, webpack.Stats|undefined>(webpack)

export {
  webpackPromisify
}
