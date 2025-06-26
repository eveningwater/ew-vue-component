import type { Component, VNode, App } from 'vue'

// 组件类型
export type ComponentType = string | Component | ComponentObject | (() => Promise<Component>)

// 组件对象接口
export interface ComponentObject {
  render: () => VNode
  name?: string
  props?: Record<string, any>
  emits?: string[]
  setup?: () => any
}

// 插件接口
export interface Plugin {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}

// 插件上下文
export interface PluginContext {
  component: any
  data: Record<string, any>
  utils: {
    warn: (message: string) => void
    log: (message: string, data?: any) => void
  }
}

// 组件 Props
export interface EwVueComponentProps {
  is: ComponentType
  fallback?: string | Component | ComponentObject
  errorComponent?: string | Component | ComponentObject
  cache?: boolean
  cacheKey?: string
  cacheTtl?: number
  plugins?: Plugin[]
}

// 组件事件
export interface EwVueComponentEmits {
  error: [error: Error]
}

// 缓存选项
export interface CacheOptions {
  maxSize?: number
  ttl?: number
  onEvict?: (key: string, value: any) => void
}

// 缓存管理器
export interface CacheManager {
  set(key: string, value: any): void
  get(key: string): any
  has(key: string): boolean
  delete(key: string): boolean
  clear(): void
  size(): number
  keys(): string[]
  values(): any[]
  entries(): [string, any][]
}

// 异步组件选项
export interface AsyncComponentOptions {
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  onError?: (error: Error) => void
}

// 错误边界选项
export interface ErrorBoundaryOptions {
  fallback?: Component | ((error: Error) => VNode)
  onError?: (error: Error, errorInfo: any) => void
  resetKeys?: any[]
}

// 性能监控选项
export interface PerformanceOptions {
  enabled?: boolean
  threshold?: number
  onSlowRender?: (duration: number, component: any) => void
  onError?: (error: Error) => void
}

// 性能监控器
export interface PerformanceMonitor {
  start(name: string): void
  end(name: string): number
  measure(name: string, startName: string, endName: string): PerformanceMeasure
  getMeasures(): PerformanceMeasure[]
  clear(): void
}

// 插件管理器
export interface PluginManager {
  register(name: string, plugin: Plugin): void
  get(name: string): Plugin | undefined
  has(name: string): boolean
  unregister(name: string): boolean
  create(config: Record<string, any>): Plugin[]
  list(): string[]
}

// 组件选项
export interface ComponentOptions {
  name?: string
  props?: string[] | Record<string, any>
  render: () => VNode
  setup?: () => any
}

// 插件选项
export interface PluginOptions {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}

// 错误处理选项
export interface ErrorHandlerOptions {
  fallback?: Component
  reportToServer?: boolean
  showUserMessage?: boolean
  retryCount?: number
  maxRetries?: number
} 