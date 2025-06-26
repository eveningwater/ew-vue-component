import EwVueComponent from './component'
import * as utils from './utils'
import * as plugin from './plugin'
import type * as types from './types'

// 主组件
export { EwVueComponent }

// 工具函数
export { utils }

// 插件系统
export { plugin }

// 类型定义
export { types }

// 默认导出
export default EwVueComponent

// 插件安装函数
export const install = (app: any) => {
  app.component('EwVueComponent', EwVueComponent)
}

// 版本信息
export const version = '1.0.0'
