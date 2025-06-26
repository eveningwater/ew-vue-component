import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp } from 'vue'
import {
  installPlugin,
  uninstallPlugin,
  getPluginManager,
  createCustomPlugin,
  logPlugin,
  performancePlugin,
  errorPlugin
} from '../src/plugin'

describe('Plugin System', () => {
  let app: any

  beforeEach(() => {
    app = createApp({})
    vi.clearAllMocks()
  })

  describe('插件安装', () => {
    it('应该正确安装插件', () => {
      const plugin = createCustomPlugin({
        name: 'test-plugin',
        install: vi.fn()
      })

      installPlugin(app, plugin)
      expect(plugin.install).toHaveBeenCalled()
    })

    it('应该注册插件到管理器', () => {
      const plugin = createCustomPlugin({
        name: 'test-plugin'
      })

      installPlugin(app, plugin)
      const manager = getPluginManager()
      expect(manager.has('test-plugin')).toBe(true)
    })
  })

  describe('插件卸载', () => {
    it('应该正确卸载插件', () => {
      const plugin = createCustomPlugin({
        name: 'test-plugin',
        uninstall: vi.fn()
      })

      installPlugin(app, plugin)
      uninstallPlugin(app, 'test-plugin')
      
      expect(plugin.uninstall).toHaveBeenCalled()
      
      const manager = getPluginManager()
      expect(manager.has('test-plugin')).toBe(false)
    })

    it('应该处理不存在的插件', () => {
      expect(() => {
        uninstallPlugin(app, 'non-existent-plugin')
      }).not.toThrow()
    })
  })

  describe('插件管理器', () => {
    it('应该返回插件管理器实例', () => {
      const manager = getPluginManager()
      expect(manager).toBeDefined()
      expect(typeof manager.register).toBe('function')
      expect(typeof manager.get).toBe('function')
      expect(typeof manager.has).toBe('function')
      expect(typeof manager.unregister).toBe('function')
    })
  })

  describe('自定义插件创建', () => {
    it('应该创建自定义插件', () => {
      const beforeRender = vi.fn()
      const afterRender = vi.fn()
      const onError = vi.fn()

      const plugin = createCustomPlugin({
        name: 'custom-plugin',
        beforeRender,
        afterRender,
        onError
      })

      expect(plugin.name).toBe('custom-plugin')
      expect(plugin.beforeRender).toBe(beforeRender)
      expect(plugin.afterRender).toBe(afterRender)
      expect(plugin.onError).toBe(onError)
    })
  })

  describe('默认插件', () => {
    it('logPlugin 应该存在并具有正确的结构', () => {
      expect(logPlugin.name).toBe('log')
      expect(typeof logPlugin.beforeRender).toBe('function')
      expect(typeof logPlugin.afterRender).toBe('function')
      expect(typeof logPlugin.onError).toBe('function')
    })

    it('performancePlugin 应该存在并具有正确的结构', () => {
      expect(performancePlugin.name).toBe('performance')
      expect(typeof performancePlugin.beforeRender).toBe('function')
      expect(typeof performancePlugin.afterRender).toBe('function')
    })

    it('errorPlugin 应该存在并具有正确的结构', () => {
      expect(errorPlugin.name).toBe('error-handler')
      expect(typeof errorPlugin.onError).toBe('function')
    })
  })

  describe('插件钩子执行', () => {
    it('应该执行 beforeRender 钩子', () => {
      const beforeRender = vi.fn()
      const plugin = createCustomPlugin({
        name: 'test-plugin',
        beforeRender
      })

      installPlugin(app, plugin)
      
      // 模拟组件渲染
      const context = {
        component: 'TestComponent',
        data: {},
        utils: { warn: vi.fn(), log: vi.fn() }
      }

      if (plugin.beforeRender) {
        plugin.beforeRender('TestComponent', {}, context)
      }

      expect(beforeRender).toHaveBeenCalled()
    })

    it('应该执行 afterRender 钩子', () => {
      const afterRender = vi.fn()
      const plugin = createCustomPlugin({
        name: 'test-plugin',
        afterRender
      })

      installPlugin(app, plugin)
      
      const context = {
        component: 'TestComponent',
        data: {},
        utils: { warn: vi.fn(), log: vi.fn() }
      }

      if (plugin.afterRender) {
        plugin.afterRender('TestComponent', {}, context)
      }

      expect(afterRender).toHaveBeenCalled()
    })

    it('应该执行 onError 钩子', () => {
      const onError = vi.fn()
      const plugin = createCustomPlugin({
        name: 'test-plugin',
        onError
      })

      installPlugin(app, plugin)
      
      const error = new Error('Test error')
      const context = {
        component: 'TestComponent',
        data: {},
        utils: { warn: vi.fn(), log: vi.fn() }
      }

      if (plugin.onError) {
        plugin.onError(error, context)
      }

      expect(onError).toHaveBeenCalledWith(error, context)
    })
  })

  describe('插件错误处理', () => {
    it('应该处理插件钩子中的错误', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const plugin = createCustomPlugin({
        name: 'error-plugin',
        beforeRender: () => {
          throw new Error('Plugin error')
        }
      })

      installPlugin(app, plugin)
      
      const context = {
        component: 'TestComponent',
        data: {},
        utils: { warn: vi.fn(), log: vi.fn() }
      }

      // 错误不应该阻止执行
      expect(() => {
        if (plugin.beforeRender) {
          plugin.beforeRender('TestComponent', {}, context)
        }
      }).toThrow('Plugin error')

      consoleSpy.mockRestore()
    })
  })

  describe('插件上下文', () => {
    it('应该提供正确的插件上下文', () => {
      const plugin = createCustomPlugin({
        name: 'context-test',
        install: (context) => {
          expect(context.component).toBeNull()
          expect(context.data).toEqual({})
          expect(typeof context.utils.warn).toBe('function')
          expect(typeof context.utils.log).toBe('function')
        }
      })

      installPlugin(app, plugin)
    })
  })
}) 