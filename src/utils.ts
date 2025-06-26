import type { Component } from 'vue'
import type { 
  ComponentObject, 
  CacheOptions, 
  CacheManager,
  Plugin,
  PluginOptions,
  ComponentOptions,
  AsyncComponentOptions,
  PerformanceOptions,
  PerformanceMonitor,
  PluginManager,
  ErrorHandlerOptions
} from './types'

// 基础工具函数
export const isString = (val: unknown): val is string =>
  typeof val === "string";

export const warn = <T>(...msg: T[]) => {
  console.warn(
    '%c[EwVueComponent]',
    'background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ...msg
  );
};

export const log = <T>(...msg: T[]) => {
  console.log(
    '%c[EwVueComponent]',
    'background: linear-gradient(45deg, #10b981 0%, #059669 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ...msg
  );
};

// 组件验证函数
export const isComponent = (value: any): boolean => {
  if (!value) return false
  return isString(value) || 
         typeof value === 'function' || 
         (typeof value === 'object' && value && typeof value.render === 'function')
}

export const isAsyncComponent = (value: any): boolean => {
  if (!value || typeof value !== 'function') return false
  const funcString = value.toString()
  return funcString.includes('import') || funcString.includes('Promise')
}

export const isComponentObject = (value: any): boolean => {
  return typeof value === 'object' && value && typeof value.render === 'function'
}

export const validateComponent = (component: any): boolean => {
  return isComponent(component)
}

// 组件创建函数
export const createComponent = (options: ComponentOptions): ComponentObject => {
  return {
    name: options.name || 'AnonymousComponent',
    props: options.props,
    render: options.render,
    setup: options.setup
  }
}

export const createAsyncComponent = (
  loader: () => Promise<Component>,
  options: AsyncComponentOptions = {}
): (() => Promise<Component>) => {
  return async () => {
    try {
      if (options.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay))
      }
      
      const component = await loader()
      return component
    } catch (error) {
      if (options.onError) {
        options.onError(error as Error)
      }
      throw error
    }
  }
}

// 缓存管理器
export const createCache = (options: CacheOptions = {}): CacheManager => {
  const cache = new Map<string, { value: any; timestamp: number }>()
  const { maxSize = 100, ttl = 300000, onEvict } = options

  const cleanup = () => {
    const now = Date.now()
    for (const [key, item] of cache.entries()) {
      if (ttl && now - item.timestamp > ttl) {
        cache.delete(key)
        if (onEvict) onEvict(key, item.value)
      }
    }
  }

  // 定期清理过期项
  if (ttl) {
    setInterval(cleanup, Math.min(ttl, 60000))
  }

  return {
    set(key: string, value: any) {
      // 检查缓存大小
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value
        if (firstKey) {
          const item = cache.get(firstKey)
          cache.delete(firstKey)
          if (onEvict && item) onEvict(firstKey, item.value)
        }
      }
      
      cache.set(key, { value, timestamp: Date.now() })
    },

    get(key: string) {
      const item = cache.get(key)
      if (!item) return undefined
      
      // 检查是否过期
      if (ttl && Date.now() - item.timestamp > ttl) {
        cache.delete(key)
        if (onEvict) onEvict(key, item.value)
        return undefined
      }
      
      return item.value
    },

    has(key: string) {
      return cache.has(key) && this.get(key) !== undefined
    },

    delete(key: string) {
      const item = cache.get(key)
      const deleted = cache.delete(key)
      if (deleted && onEvict && item) {
        onEvict(key, item.value)
      }
      return deleted
    },

    clear() {
      if (onEvict) {
        for (const [key, item] of cache.entries()) {
          onEvict(key, item.value)
        }
      }
      cache.clear()
    },

    size() {
      cleanup()
      return cache.size
    },

    keys() {
      cleanup()
      return Array.from(cache.keys())
    },

    values() {
      cleanup()
      return Array.from(cache.values()).map(item => item.value)
    },

    entries() {
      cleanup()
      return Array.from(cache.entries()).map(([key, item]) => [key, item.value])
    }
  }
}

// 插件创建函数
export const createPlugin = (options: PluginOptions): Plugin => {
  return {
    name: options.name,
    beforeRender: options.beforeRender,
    afterRender: options.afterRender,
    onError: options.onError,
    install: options.install,
    uninstall: options.uninstall
  }
}

// 插件管理器
export const createPluginManager = (): PluginManager => {
  const plugins = new Map<string, Plugin>()

  return {
    register(name: string, plugin: Plugin) {
      plugins.set(name, plugin)
    },

    get(name: string) {
      return plugins.get(name)
    },

    has(name: string) {
      return plugins.has(name)
    },

    unregister(name: string) {
      return plugins.delete(name)
    },

    create(config: Record<string, any>) {
      return Object.entries(config).map(([name, options]) => {
        const plugin = plugins.get(name)
        if (!plugin) {
          throw new Error(`Plugin "${name}" not found`)
        }
        return plugin
      })
    },

    list() {
      return Array.from(plugins.keys())
    }
  }
}

// 性能监控器
export const createPerformanceMonitor = (options: PerformanceOptions = {}): PerformanceMonitor => {
  const { enabled = true, threshold = 100, onSlowRender, onError } = options
  const measures: PerformanceMeasure[] = []
  const startTimes = new Map<string, number>()

  return {
    start(name: string) {
      if (!enabled) return
      
      try {
        performance.mark(`${name}-start`)
        startTimes.set(name, performance.now())
      } catch (error) {
        if (onError) onError(error as Error)
      }
    },

    end(name: string) {
      if (!enabled) return 0
      
      try {
        const startTime = startTimes.get(name)
        if (!startTime) return 0

        const endTime = performance.now()
        const duration = endTime - startTime

        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)

        startTimes.delete(name)

        // 检查是否超过阈值
        if (duration > threshold && onSlowRender) {
          onSlowRender(duration, name)
        }

        return duration
      } catch (error) {
        if (onError) onError(error as Error)
        return 0
      }
    },

    measure(name: string, startName: string, endName: string) {
      if (!enabled) return {} as PerformanceMeasure
      
      try {
        return performance.measure(name, startName, endName)
      } catch (error) {
        if (onError) onError(error as Error)
        return {} as PerformanceMeasure
      }
    },

    getMeasures() {
      return measures
    },

    clear() {
      measures.length = 0
      startTimes.clear()
      try {
        performance.clearMarks()
        performance.clearMeasures()
      } catch (error) {
        if (onError) onError(error as Error)
      }
    }
  }
}

// 错误处理函数
export const handleComponentError = (
  error: Error,
  component: any,
  options: ErrorHandlerOptions = {}
) => {
  const { reportToServer = false, showUserMessage = true, retryCount = 0, maxRetries = 3 } = options

  // 记录错误
  warn('Component error:', error.message)

  // 上报到服务器
  if (reportToServer) {
    // 这里可以实现错误上报逻辑
    console.error('Error reported to server:', {
      error: error.message,
      stack: error.stack,
      component,
      timestamp: new Date().toISOString()
    })
  }

  // 显示用户消息
  if (showUserMessage) {
    console.warn('组件加载失败，请稍后重试')
  }

  // 重试逻辑
  if (retryCount < maxRetries) {
    console.log(`Retrying... (${retryCount + 1}/${maxRetries})`)
  }
}

// 默认插件
export const logPlugin = createPlugin({
  name: 'log',
  beforeRender(component, props, context) {
    context.utils.log(`开始渲染组件: ${component.name || component}`, {
      component,
      props: Object.keys(props)
    })
  },
  afterRender(component, props, context) {
    context.utils.log(`组件渲染完成: ${component.name || component}`)
  },
  onError(error, context) {
    context.utils.warn(`组件渲染错误: ${error.message}`)
  }
})

export const performancePlugin = createPlugin({
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark(`render-start-${component.name || 'unknown'}`)
    context.data.renderStartTime = performance.now()
  },
  afterRender(component, props, context) {
    const endTime = performance.now()
    const duration = endTime - context.data.renderStartTime
    
    performance.mark(`render-end-${component.name || 'unknown'}`)
    performance.measure(
      `render-${component.name || 'unknown'}`,
      `render-start-${component.name || 'unknown'}`,
      `render-end-${component.name || 'unknown'}`
    )
    
    context.utils.log(`组件渲染耗时: ${duration.toFixed(2)}ms`)
  }
})

export const errorPlugin = createPlugin({
  name: 'error-handler',
  onError(error, context) {
    // 记录错误到服务器
    console.error('错误已上报:', {
      error: error.message,
      stack: error.stack,
      component: context.component,
      timestamp: new Date().toISOString()
    })
    
    // 显示用户友好的错误信息
    console.warn('组件加载失败，请稍后重试')
  }
})
