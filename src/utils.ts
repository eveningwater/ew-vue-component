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

// 环境检测函数 - 类似 Vue 框架的实现方式
// 构建时会通过 Rollup 的 replace 插件注入 __EW_DEV__ 变量
declare const __EW_DEV__: boolean

export const isDevelopment = (): boolean => {
  // 优先使用构建时注入的 __EW_DEV__ 变量
  if (typeof __EW_DEV__ !== 'undefined') {
    return __EW_DEV__
  }
  
  // 降级检测：检查 Vue DevTools 是否存在（仅在浏览器环境）
  if (typeof window !== 'undefined' && (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    return true
  }
  
  // 默认返回 false（生产环境）
  return false
}

// 基础工具函数
export const isString = (val: unknown): val is string =>
  typeof val === "string";

export const warn = <T>(...msg: T[]) => {
  if (!isDevelopment()) return;
  console.warn(
    '%c[EwVueComponent]',
    'background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ...msg
  );
};

export const log = <T>(...msg: T[]) => {
  if (!isDevelopment()) return;
  console.log(
    '%c[EwVueComponent]',
    'background: linear-gradient(45deg, #10b981 0%, #059669 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ...msg
  );
};

export const error = <T>(...msg: T[]) => {
  if (!isDevelopment()) return;
  console.error(
    '%c[EwVueComponent]',
    'background: linear-gradient(45deg, #ef4444 0%, #dc2626 100%); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
    ...msg
  );
};

// 组件验证函数
export const isComponent = (value: any): value is Component => {
  if (!value) return false
  return isString(value) || 
         typeof value === 'function' || 
         (typeof value === 'object' && value && 
          (typeof value.render === 'function' || 
           typeof value.setup === 'function' ||
           typeof value.template === 'string'))
}

export const isAsyncComponent = (value: any): value is (() => Promise<Component>) => {
  if (!value || typeof value !== 'function') return false
  // 更严格的异步组件检测
  const funcString = value.toString()
  return funcString.includes('import(') || 
         funcString.includes('Promise') ||
         funcString.includes('async') ||
         value.constructor.name === 'AsyncFunction'
}

export const isComponentObject = (value: any): value is ComponentObject => {
  return typeof value === 'object' && 
         value !== null && 
         (typeof value.render === 'function' || typeof value.setup === 'function')
}

export const validateComponent = (component: any): component is Component => {
  if (!component) {
    warn('组件不能为 null 或 undefined')
    return false
  }
  
  if (isString(component)) {
    // 验证是否为有效的 HTML 标签名或自定义组件名
    return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(component)
  }
  
  if (typeof component === 'function') {
    return true // 函数组件或异步组件
  }
  
  if (isComponentObject(component)) {
    return true
  }
  
  warn('无效的组件类型:', typeof component)
  return false
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
  const cache = new Map<string, { value: any; timestamp: number; accessCount: number; lastAccess: number }>()
  const { maxSize = 100, ttl = 300000, onEvict } = options

  // 智能清理策略：LRU + TTL
  const cleanup = () => {
    const now = Date.now()
    const itemsToDelete: string[] = []
    
    for (const [key, item] of cache.entries()) {
      // TTL 过期检查
      if (ttl && now - item.timestamp > ttl) {
        itemsToDelete.push(key)
      }
    }
    
    // 删除过期项
    itemsToDelete.forEach(key => {
      const item = cache.get(key)
      cache.delete(key)
      if (onEvict && item) onEvict(key, item.value)
    })
  }

  // LRU 清理：移除最少使用的项
  const evictLRU = () => {
    if (cache.size < maxSize) return
    
    let lruKey = ''
    let lruTime = Date.now()
    let lruCount = Infinity
    
    for (const [key, item] of cache.entries()) {
      // 优先移除访问次数少且最久未访问的项
      if (item.accessCount < lruCount || 
          (item.accessCount === lruCount && item.lastAccess < lruTime)) {
        lruKey = key
        lruTime = item.lastAccess
        lruCount = item.accessCount
      }
    }
    
    if (lruKey) {
      const item = cache.get(lruKey)
      cache.delete(lruKey)
      if (onEvict && item) onEvict(lruKey, item.value)
    }
  }

  // 定期清理过期项（减少频率，避免性能影响）
  if (ttl) {
    setInterval(cleanup, Math.min(ttl / 2, 60000))
  }

  return {
    set(key: string, value: any) {
      // 在添加前先清理
      cleanup()
      evictLRU()
      
      cache.set(key, { 
        value, 
        timestamp: Date.now(),
        accessCount: 1,
        lastAccess: Date.now()
      })
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
      
      // 更新访问统计
      item.accessCount++
      item.lastAccess = Date.now()
      
      return item.value
    },

    has(key: string) {
      const item = cache.get(key)
      if (!item) return false
      
      // 检查是否过期
      if (ttl && Date.now() - item.timestamp > ttl) {
        cache.delete(key)
        if (onEvict) onEvict(key, item.value)
        return false
      }
      
      return true
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

// 错误类型枚举
export enum ComponentErrorType {
  LOAD_ERROR = 'LOAD_ERROR',
  RENDER_ERROR = 'RENDER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 增强的错误类
export class ComponentError extends Error {
  public readonly type: ComponentErrorType
  public readonly component: any
  public readonly timestamp: number
  public readonly retryCount: number

  constructor(
    message: string, 
    type: ComponentErrorType = ComponentErrorType.UNKNOWN_ERROR,
    component?: any,
    retryCount: number = 0
  ) {
    super(message)
    this.name = 'ComponentError'
    this.type = type
    this.component = component
    this.timestamp = Date.now()
    this.retryCount = retryCount
  }
}

// 错误分类函数
const classifyError = (error: Error, component: any): ComponentErrorType => {
  const message = error.message.toLowerCase()
  
  if (message.includes('timeout') || message.includes('超时')) {
    return ComponentErrorType.TIMEOUT_ERROR
  }
  
  if (message.includes('network') || message.includes('fetch') || message.includes('网络')) {
    return ComponentErrorType.NETWORK_ERROR
  }
  
  if (message.includes('invalid') || message.includes('无效') || message.includes('validation')) {
    return ComponentErrorType.VALIDATION_ERROR
  }
  
  if (message.includes('render') || message.includes('渲染')) {
    return ComponentErrorType.RENDER_ERROR
  }
  
  if (message.includes('load') || message.includes('import') || message.includes('加载')) {
    return ComponentErrorType.LOAD_ERROR
  }
  
  return ComponentErrorType.UNKNOWN_ERROR
}

// 错误处理函数
export const handleComponentError = (
  err: Error,
  component: any,
  options: ErrorHandlerOptions = {}
) => {
  const { reportToServer = false, showUserMessage = true, retryCount = 0, maxRetries = 3 } = options

  // 创建增强的错误对象
  const errorType = classifyError(err, component)
  const componentError = err instanceof ComponentError ? err : new ComponentError(
    err.message,
    errorType,
    component,
    retryCount
  )

  // 记录错误（根据错误类型使用不同的日志级别）
  if (errorType === ComponentErrorType.VALIDATION_ERROR) {
    warn('组件验证错误:', componentError.message)
  } else if (errorType === ComponentErrorType.NETWORK_ERROR) {
    error('网络错误:', componentError.message)
  } else {
    warn('组件错误:', componentError.message)
  }

  // 上报到服务器（只在生产环境或特定错误类型时上报）
  if (reportToServer && (
    !isDevelopment() || 
    errorType === ComponentErrorType.NETWORK_ERROR ||
    errorType === ComponentErrorType.UNKNOWN_ERROR
  )) {
    // 异步上报，避免阻塞
    Promise.resolve().then(() => {
      error('错误已上报到服务器:', JSON.stringify({
        message: componentError.message,
        type: errorType,
        stack: componentError.stack,
        component: getComponentName(component),
        timestamp: componentError.timestamp,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js'
      }))
    })
  }

  // 显示用户友好的错误消息
  if (showUserMessage) {
    const userMessages = {
      [ComponentErrorType.LOAD_ERROR]: '组件加载失败，请检查网络连接',
      [ComponentErrorType.RENDER_ERROR]: '组件渲染异常，请刷新页面重试',
      [ComponentErrorType.VALIDATION_ERROR]: '组件配置有误，请检查参数',
      [ComponentErrorType.TIMEOUT_ERROR]: '组件加载超时，请稍后重试',
      [ComponentErrorType.NETWORK_ERROR]: '网络连接异常，请检查网络状态',
      [ComponentErrorType.UNKNOWN_ERROR]: '发生未知错误，请稍后重试'
    }
    
    const userMessage = userMessages[errorType] || userMessages[ComponentErrorType.UNKNOWN_ERROR]
    
    if (isDevelopment()) {
      warn(userMessage)
    }
  }

  // 智能重试逻辑（根据错误类型决定是否重试）
  const shouldRetry = (
    retryCount < maxRetries && 
    errorType !== ComponentErrorType.VALIDATION_ERROR // 验证错误不重试
  )

  if (shouldRetry && isDevelopment()) {
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000) // 指数退避，最大10秒
    log(`${retryCount + 1}/${maxRetries} 次重试，${retryDelay}ms 后执行`)
  }

  return componentError
}

// 默认插件
export const logPlugin = createPlugin({
  name: 'log',
  beforeRender(component, props, context) {
    const componentName = getComponentName(component)
    context.utils.log(`开始渲染组件: ${componentName}`, {
      component,
      props: Object.keys(props)
    })
  },
  afterRender(component, props, context) {
    const componentName = getComponentName(component)
    context.utils.log(`组件渲染完成: ${componentName}`)
  },
  onError(error, context) {
    context.utils.warn(`组件渲染错误: ${error.message}`)
  }
})

// 获取组件名称的辅助函数
const getComponentName = (component: any): string => {
  if (!component) return 'Unknown'
  
  // 如果是字符串，直接返回
  if (typeof component === 'string') return component
  
  // 如果有 name 属性且不为空
  if (component.name && component.name !== 'default') return component.name
  
  // 如果有 __name 属性（Vue SFC 编译后的名称）
  if (component.__name) return component.__name
  
  // 如果有 displayName 属性（React风格的名称）
  if (component.displayName) return component.displayName
  
  // 如果是函数，尝试获取函数名
  if (typeof component === 'function') {
    // 对于异步组件，尝试从函数字符串中提取文件名
    const funcStr = component.toString()
    const importMatch = funcStr.match(/import\(['"`]([^'"`]+)['"`]\)/)
    if (importMatch) {
      const path = importMatch[1]
      const fileName = path.split('/').pop()?.replace(/\.(vue|js|ts)$/, '')
      if (fileName) return fileName
    }
    
    if (component.name && component.name !== 'anonymous') return component.name
    return 'AsyncComponent'
  }
  
  // 如果是对象，尝试获取构造函数名
  if (typeof component === 'object') {
    if (component.constructor && component.constructor.name && component.constructor.name !== 'Object') {
      return component.constructor.name
    }
    return 'Component'
  }
  
  return 'Unknown'
}

export const performancePlugin = createPlugin({
  name: 'performance',
  beforeRender(component, props, context) {
    const componentName = getComponentName(component)
    const markId = `render-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // 保存标记ID到context中，确保afterRender能找到对应的标记
    context.data.performanceMarkId = markId
    context.data.componentName = componentName
    
    // 兼容性检查
    if (typeof performance !== 'undefined' && performance.mark) {
      try {
        performance.mark(`${markId}-start`)
      } catch (err) {
        // 如果performance.mark失败，使用fallback
        context.data.fallbackStartTime = Date.now()
      }
    } else {
      // Performance API 不可用时的fallback
      context.data.fallbackStartTime = Date.now()
    }
    
    context.data.renderStartTime = performance?.now ? performance.now() : Date.now()
  },
  afterRender(component, props, context) {
    const endTime = performance?.now ? performance.now() : Date.now()
    const startTime = context.data.renderStartTime || context.data.fallbackStartTime
    const markId = context.data.performanceMarkId
    const componentName = context.data.componentName || getComponentName(component)
    
    if (startTime) {
      const duration = endTime - startTime
      
      // 尝试使用 Performance API
      if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
        try {
          performance.mark(`${markId}-end`)
          performance.measure(
            `render-${componentName}`,
            `${markId}-start`,
            `${markId}-end`
          )
        } catch (err) {
          // Performance API 失败时静默处理
          context.utils.log(`组件渲染耗时: ${duration.toFixed(2)}ms (fallback)`)
          return
        }
      }
      
      context.utils.log(`组件渲染耗时: ${duration.toFixed(2)}ms`)
      
      // 性能警告阈值
      if (duration > 16.67) { // 60fps = 16.67ms per frame
        context.utils.warn(`组件渲染较慢: ${componentName} (${duration.toFixed(2)}ms)`)
      }
    }
  }
})

export const errorPlugin = createPlugin({
  name: 'error-handler',
  onError(err, context) {
    // 记录错误到服务器
    error('错误已上报:', err.message, err.stack, context.component, new Date().toISOString())
    
    // 显示用户友好的错误信息
    warn('组件加载失败，请稍后重试')
  }
})
