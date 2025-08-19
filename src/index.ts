import EwVueComponent, { destroyGlobalResources } from './component'
import * as utils from './utils'
import * as plugin from './plugin'
import type * as types from './types'
// 从 package.json 导入版本号
import packageInfo from '../package.json'
import { App } from 'vue'

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
export const install = (app: App, options?: { globalPlugins?: plugin.Plugin[], [key: string]: any }) => {
  app.component('EwVueComponent', EwVueComponent)
  
  // 可选的全局配置
  if (options?.globalPlugins) {
    const pluginManager = plugin.getPluginManager()
    options.globalPlugins.forEach((p: plugin.Plugin) => {
      pluginManager.register(p.name, p)
    })
  }
}

// 版本信息（从 package.json 导入）
export const version = packageInfo.version

// 库信息
export const libraryInfo = {
  name: packageInfo.name,
  version: packageInfo.version,
  description: packageInfo.description,
  author: packageInfo.author,
  license: packageInfo.license
}
