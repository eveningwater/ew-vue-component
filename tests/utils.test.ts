import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  isString,
  warn,
  log,
  isComponent,
  isAsyncComponent,
  isComponentObject,
  validateComponent,
  createComponent,
  createAsyncComponent,
  createCache,
  createPlugin,
  createPluginManager,
  createPerformanceMonitor,
  handleComponentError,
  logPlugin,
  performancePlugin,
  errorPlugin
} from '../src/utils'

describe('Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基础工具函数', () => {
    it('isString 应该正确判断字符串', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
    })

    it('warn 应该输出警告信息', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      warn('test warning')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('log 应该输出日志信息', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      log('test log')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('组件验证函数', () => {
    it('isComponent 应该正确验证组件', () => {
      expect(isComponent('div')).toBe(true)
      expect(isComponent(() => {})).toBe(true)
      expect(isComponent({ render: () => {} })).toBe(true)
      expect(isComponent(null)).toBe(false)
      expect(isComponent(undefined)).toBe(false)
      expect(isComponent(123)).toBe(false)
    })

    it('isAsyncComponent 应该正确识别异步组件', () => {
      const asyncLoader = () => Promise.resolve({ name: 'AsyncComponent', render: () => ({}) })
      expect(isAsyncComponent(asyncLoader)).toBe(true)
      expect(isAsyncComponent(() => Promise.resolve({}))).toBe(true)
      expect(isAsyncComponent(() => {})).toBe(false)
      expect(isAsyncComponent('div')).toBe(false)
    })

    it('isComponentObject 应该正确识别组件对象', () => {
      expect(isComponentObject({ render: () => {} })).toBe(true)
      expect(isComponentObject({ name: 'test' })).toBe(false)
      expect(isComponentObject(() => {})).toBe(false)
      expect(isComponentObject('div')).toBe(false)
    })

    it('validateComponent 应该正确验证组件', () => {
      expect(validateComponent('div')).toBe(true)
      expect(validateComponent(() => {})).toBe(true)
      expect(validateComponent({ render: () => {} })).toBe(true)
      expect(validateComponent(null)).toBe(false)
    })
  })

  describe('组件创建函数', () => {
    it('createComponent 应该创建组件对象', () => {
      const render = vi.fn()
      const component = createComponent({
        name: 'TestComponent',
        props: ['message'],
        render
      })

      expect(component.name).toBe('TestComponent')
      expect(component.props).toEqual(['message'])
      expect(component.render).toBe(render)
    })

    it('createAsyncComponent 应该创建异步组件', async () => {
      const loader = () => Promise.resolve({ name: 'Test' })
      const asyncComponent = createAsyncComponent(loader, {
        delay: 100,
        onError: vi.fn()
      })

      const result = await asyncComponent()
      expect(result.name).toBe('Test')
    })
  })

  describe('缓存管理器', () => {
    it('应该正确设置和获取缓存', () => {
      const cache = createCache()
      cache.set('test', 'value')
      expect(cache.get('test')).toBe('value')
    })

    it('应该检查缓存是否存在', () => {
      const cache = createCache()
      expect(cache.has('test')).toBe(false)
      cache.set('test', 'value')
      expect(cache.has('test')).toBe(true)
    })

    it('应该删除缓存项', () => {
      const cache = createCache()
      cache.set('test', 'value')
      expect(cache.delete('test')).toBe(true)
      expect(cache.get('test')).toBeUndefined()
    })

    it('应该清空缓存', () => {
      const cache = createCache()
      cache.set('test1', 'value1')
      cache.set('test2', 'value2')
      cache.clear()
      expect(cache.size()).toBe(0)
    })

    it('应该限制缓存大小', () => {
      const cache = createCache({ maxSize: 2 })
      cache.set('test1', 'value1')
      cache.set('test2', 'value2')
      cache.set('test3', 'value3')
      expect(cache.size()).toBe(2)
    })

    it('应该处理缓存过期', () => {
      const cache = createCache({ ttl: 100 })
      cache.set('test', 'value')
      expect(cache.get('test')).toBe('value')
      
      // 等待过期
      return new Promise(resolve => {
        setTimeout(() => {
          expect(cache.get('test')).toBeUndefined()
          resolve(undefined)
        }, 150)
      })
    })
  })

  describe('插件系统', () => {
    it('createPlugin 应该创建插件', () => {
      const beforeRender = vi.fn()
      const afterRender = vi.fn()
      const onError = vi.fn()

      const plugin = createPlugin({
        name: 'test-plugin',
        beforeRender,
        afterRender,
        onError
      })

      expect(plugin.name).toBe('test-plugin')
      expect(plugin.beforeRender).toBe(beforeRender)
      expect(plugin.afterRender).toBe(afterRender)
      expect(plugin.onError).toBe(onError)
    })

    it('createPluginManager 应该管理插件', () => {
      const manager = createPluginManager()
      const plugin = createPlugin({ name: 'test' })

      manager.register('test', plugin)
      expect(manager.has('test')).toBe(true)
      expect(manager.get('test')).toBe(plugin)

      expect(manager.unregister('test')).toBe(true)
      expect(manager.has('test')).toBe(false)
    })

    it('插件管理器应该列出所有插件', () => {
      const manager = createPluginManager()
      const plugin1 = createPlugin({ name: 'plugin1' })
      const plugin2 = createPlugin({ name: 'plugin2' })

      manager.register('plugin1', plugin1)
      manager.register('plugin2', plugin2)

      const plugins = manager.list()
      expect(plugins).toContain('plugin1')
      expect(plugins).toContain('plugin2')
    })
  })

  describe('性能监控器', () => {
    it('应该监控性能', () => {
      const monitor = createPerformanceMonitor()
      monitor.start('test')
      const duration = monitor.end('test')
      expect(duration).toBeGreaterThan(0)
    })

    it('应该处理慢渲染警告', () => {
      const onSlowRender = vi.fn()
      const monitor = createPerformanceMonitor({ 
        threshold: 0,
        onSlowRender 
      })

      monitor.start('test')
      monitor.end('test')
      expect(onSlowRender).toHaveBeenCalled()
    })

    it('应该测量性能', () => {
      const monitor = createPerformanceMonitor()
      monitor.start('start')
      monitor.start('end')
      monitor.end('end')
      const measure = monitor.measure('test', 'start', 'end')
      expect(measure).toBeDefined()
    })
  })

  describe('错误处理', () => {
    it('handleComponentError 应该处理错误', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = new Error('Test error')
      
      handleComponentError(error, 'TestComponent', {
        reportToServer: true,
        showUserMessage: true
      })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('默认插件', () => {
    it('logPlugin 应该存在', () => {
      expect(logPlugin.name).toBe('log')
      expect(typeof logPlugin.beforeRender).toBe('function')
      expect(typeof logPlugin.afterRender).toBe('function')
      expect(typeof logPlugin.onError).toBe('function')
    })

    it('performancePlugin 应该存在', () => {
      expect(performancePlugin.name).toBe('performance')
      expect(typeof performancePlugin.beforeRender).toBe('function')
      expect(typeof performancePlugin.afterRender).toBe('function')
    })

    it('errorPlugin 应该存在', () => {
      expect(errorPlugin.name).toBe('error-handler')
      expect(typeof errorPlugin.onError).toBe('function')
    })
  })
}) 