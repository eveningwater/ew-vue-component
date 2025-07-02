import EwVueComponent, { destroyGlobalResources } from './component'
import * as utils from './utils'
import * as plugin from './plugin'
import type * as types from './types'

// 主组件
export { EwVueComponent }

// 全局资源管理
export { destroyGlobalResources }

// 工具函数模块
export { utils }

// 插件系统模块
export { plugin }

// 类型定义模块
export { types }

// 直接导出常用工具函数
export { 
  isDevelopment, 
  warn, 
  log, 
  error,
  isComponent,
  isAsyncComponent,
  validateComponent,
  ComponentError,
  ComponentErrorType 
} from './utils'

// 直接导出插件相关函数
export {
  installPlugin,
  uninstallPlugin,
  getPluginManager,
  createCustomPlugin
} from './plugin'

// 默认导出
export default EwVueComponent

// 插件安装函数（Vue 插件标准）
export const install = (app: any, options?: any) => {
  app.component('EwVueComponent', EwVueComponent)
  
  // 可选的全局配置
  if (options?.globalPlugins) {
    const pluginManager = plugin.getPluginManager()
    options.globalPlugins.forEach((p: any) => {
      pluginManager.register(p.name, p)
    })
  }
}

// 版本信息
export const version = '0.0.2-beta.3'

// 库信息
export const libraryInfo = {
  name: 'ew-vue-component',
  version,
  description: 'A powerful Vue 3 dynamic component wrapper',
  author: 'eveningwater',
  license: 'MIT'
}
