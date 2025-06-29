import type { App } from 'vue'
import type { Plugin, PluginOptions, PluginManager } from './types'
import { createPluginManager, createPlugin, log, warn } from './utils'

// 插件管理器实例
const pluginManager = createPluginManager()

// 插件安装函数
export const installPlugin = (_app: App, plugin: Plugin) => {
  pluginManager.register(plugin.name, plugin)
  
  if (plugin.install) {
    plugin.install({
      component: null,
      data: {},
      utils: {
        warn,
        log
      }
    })
  }
  
  log(`插件 ${plugin.name} 已安装`)
}

// 插件卸载函数
export const uninstallPlugin = (_app: App, pluginName: string) => {
  const plugin = pluginManager.get(pluginName)
  if (plugin && plugin.uninstall) {
    plugin.uninstall({
      component: null,
      data: {},
      utils: {
        warn,
        log
      }
    })
  }
  
  pluginManager.unregister(pluginName)
  log(`插件 ${pluginName} 已卸载`)
}

// 获取插件管理器
export const getPluginManager = (): PluginManager => {
  return pluginManager
}

// 创建插件
export const createCustomPlugin = (options: PluginOptions): Plugin => {
  return createPlugin(options)
}

// 默认插件导出
export { logPlugin, performancePlugin, errorPlugin } from './utils'

// 插件类型导出
export type { Plugin, PluginOptions, PluginManager } from './types' 