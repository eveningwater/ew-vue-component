# 工具函数 API

## 概述

EwVueComponent 提供了一系列实用的工具函数，帮助开发者更好地使用和管理动态组件。

## 组件验证

### isComponent

检查一个值是否为有效的组件类型。

```typescript
function isComponent(value: any): boolean
```

**参数:**
- `value`: 要检查的值

**返回值:**
- `boolean`: 如果是有效组件则返回 `true`

**示例:**

```javascript
import { isComponent } from 'ew-vue-component'

// 检查 HTML 标签
isComponent('div') // true
isComponent('span') // true
isComponent('button') // true

// 检查 Vue 组件
const MyComponent = { name: 'MyComponent', template: '<div>Hello</div>' }
isComponent(MyComponent) // true

// 检查组件对象
const componentObject = {
  render() {
    return h('div', 'Hello')
  }
}
isComponent(componentObject) // true

// 检查异步组件
const asyncComponent = () => import('./MyComponent.vue')
isComponent(asyncComponent) // true

// 检查无效值
isComponent(null) // false
isComponent(undefined) // false
isComponent(123) // false
isComponent({}) // false
```

### isAsyncComponent

检查一个值是否为异步组件。

```typescript
function isAsyncComponent(value: any): boolean
```

**参数:**
- `value`: 要检查的值

**返回值:**
- `boolean`: 如果是异步组件则返回 `true`

**示例:**

```javascript
import { isAsyncComponent } from 'ew-vue-component'

// 异步组件函数
const asyncComponent = () => import('./MyComponent.vue')
isAsyncComponent(asyncComponent) // true

// 带配置的异步组件
const asyncComponentWithConfig = () => ({
  component: import('./MyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})
isAsyncComponent(asyncComponentWithConfig) // true

// 非异步组件
isAsyncComponent('div') // false
isAsyncComponent({ name: 'MyComponent' }) // false
```

### isComponentObject

检查一个值是否为组件对象（包含 render 函数的对象）。

```typescript
function isComponentObject(value: any): boolean
```

**参数:**
- `value`: 要检查的值

**返回值:**
- `boolean`: 如果是组件对象则返回 `true`

**示例:**

```javascript
import { isComponentObject } from 'ew-vue-component'

// 组件对象
const componentObject = {
  render() {
    return h('div', 'Hello')
  }
}
isComponentObject(componentObject) // true

// 带 props 的组件对象
const componentWithProps = {
  props: ['title'],
  render() {
    return h('div', this.title)
  }
}
isComponentObject(componentWithProps) // true

// 非组件对象
isComponentObject('div') // false
isComponentObject(() => import('./MyComponent.vue')) // false
```

## 组件创建

### createComponent

创建一个组件对象。

```typescript
function createComponent(options: ComponentOptions): ComponentObject
```

**参数:**
- `options`: 组件配置选项

```typescript
interface ComponentOptions {
  name?: string
  props?: string[] | Record<string, PropDefinition>
  render: () => VNode
  setup?: () => any
}
```

**返回值:**
- `ComponentObject`: 创建的组件对象

**示例:**

```javascript
import { createComponent, h } from 'ew-vue-component'

// 基础组件
const MyComponent = createComponent({
  name: 'MyComponent',
  props: ['title', 'count'],
  render() {
    return h('div', { class: 'my-component' }, [
      h('h2', this.title),
      h('p', `Count: ${this.count}`)
    ])
  }
})

// 使用组件
<EwVueComponent :is="MyComponent" title="Hello" :count="42" />
```

### createAsyncComponent

创建一个异步组件。

```typescript
function createAsyncComponent(
  loader: () => Promise<Component>,
  options?: AsyncComponentOptions
): () => Promise<Component>
```

**参数:**
- `loader`: 组件加载函数
- `options`: 异步组件配置选项

```typescript
interface AsyncComponentOptions {
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  onError?: (error: Error) => void
}
```

**返回值:**
- `() => Promise<Component>`: 异步组件函数

**示例:**

```javascript
import { createAsyncComponent } from 'ew-vue-component'

// 基础异步组件
const AsyncComponent = createAsyncComponent(() => import('./MyComponent.vue'))

// 带配置的异步组件
const AsyncComponentWithConfig = createAsyncComponent(
  () => import('./MyComponent.vue'),
  {
    loadingComponent: LoadingSpinner,
    errorComponent: ErrorDisplay,
    delay: 200,
    timeout: 5000,
    onError: (error) => {
      console.error('组件加载失败:', error)
    }
  }
)

// 使用异步组件
<EwVueComponent :is="AsyncComponent" />
```

## 组件缓存

### createCache

创建一个组件缓存管理器。

```typescript
function createCache(options?: CacheOptions): CacheManager
```

**参数:**
- `options`: 缓存配置选项

```typescript
interface CacheOptions {
  maxSize?: number
  ttl?: number
  onEvict?: (key: string, value: any) => void
}
```

**返回值:**
- `CacheManager`: 缓存管理器实例

**示例:**

```javascript
import { createCache } from 'ew-vue-component'

// 创建缓存管理器
const cache = createCache({
  maxSize: 100,
  ttl: 300000, // 5分钟
  onEvict: (key, value) => {
    console.log('缓存项被清除:', key)
  }
})

// 缓存组件
cache.set('my-component', MyComponent)

// 获取缓存的组件
const component = cache.get('my-component')

// 检查缓存是否存在
if (cache.has('my-component')) {
  // 使用缓存的组件
}

// 清除缓存
cache.clear()
```

### CacheManager 接口

```typescript
interface CacheManager {
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
```

## 插件工具

### createPlugin

创建一个插件。

```typescript
function createPlugin(options: PluginOptions): Plugin
```

**参数:**
- `options`: 插件配置选项

```typescript
interface PluginOptions {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}
```

**返回值:**
- `Plugin`: 创建的插件对象

**示例:**

```javascript
import { createPlugin } from 'ew-vue-component'

// 创建日志插件
const logPlugin = createPlugin({
  name: 'log',
  beforeRender(component, props, context) {
    console.log('渲染前:', component.name || component, props)
  },
  afterRender(component, props, context) {
    console.log('渲染后:', component.name || component)
  },
  onError(error, context) {
    console.error('组件错误:', error)
  }
})

// 创建性能监控插件
const performancePlugin = createPlugin({
  name: 'performance',
  beforeRender(component, props, context) {
    context.data.startTime = performance.now()
  },
  afterRender(component, props, context) {
    const duration = performance.now() - context.data.startTime
    console.log(`组件渲染耗时: ${duration.toFixed(2)}ms`)
  }
})

// 使用插件
<EwVueComponent 
  :is="currentComponent"
  :plugins="[logPlugin, performancePlugin]"
/>
```

### createPluginManager

创建一个插件管理器。

```typescript
function createPluginManager(): PluginManager
```

**返回值:**
- `PluginManager`: 插件管理器实例

**示例:**

```javascript
import { createPluginManager } from 'ew-vue-component'

// 创建插件管理器
const pluginManager = createPluginManager()

// 注册插件
pluginManager.register('log', logPlugin)
pluginManager.register('performance', performancePlugin)
pluginManager.register('error', errorPlugin)

// 获取插件
const logPlugin = pluginManager.get('log')

// 创建插件配置
const plugins = pluginManager.create({
  log: { enabled: true },
  performance: { measureTime: true },
  error: { reportToServer: true }
})

// 使用插件
<EwVueComponent 
  :is="currentComponent"
  :plugins="plugins"
/>
```

### PluginManager 接口

```typescript
interface PluginManager {
  register(name: string, plugin: Plugin): void
  get(name: string): Plugin | undefined
  has(name: string): boolean
  unregister(name: string): boolean
  create(config: Record<string, any>): Plugin[]
  list(): string[]
}
```

## 错误处理

### createErrorBoundary

创建一个错误边界组件。

```typescript
function createErrorBoundary(options: ErrorBoundaryOptions): Component
```

**参数:**
- `options`: 错误边界配置选项

```typescript
interface ErrorBoundaryOptions {
  fallback?: Component | (error: Error) => VNode
  onError?: (error: Error, errorInfo: any) => void
  resetKeys?: any[]
}
```

**返回值:**
- `Component`: 错误边界组件

**示例:**

```javascript
import { createErrorBoundary, h } from 'ew-vue-component'

// 创建错误边界组件
const ErrorBoundary = createErrorBoundary({
  fallback: (error) => h('div', { class: 'error' }, [
    h('h3', '组件加载失败'),
    h('p', error.message),
    h('button', { onClick: () => window.location.reload() }, '重试')
  ]),
  onError: (error, errorInfo) => {
    console.error('错误边界捕获到错误:', error, errorInfo)
  }
})

// 使用错误边界
<ErrorBoundary>
  <EwVueComponent :is="unstableComponent" />
</ErrorBoundary>
```

### handleComponentError

处理组件错误的工具函数。

```typescript
function handleComponentError(
  error: Error,
  component: any,
  options?: ErrorHandlerOptions
): void
```

**参数:**
- `error`: 错误对象
- `component`: 出错的组件
- `options`: 错误处理配置

```typescript
interface ErrorHandlerOptions {
  fallback?: Component
  reportToServer?: boolean
  showUserMessage?: boolean
  retryCount?: number
  maxRetries?: number
}
```

**示例:**

```javascript
import { handleComponentError } from 'ew-vue-component'

// 处理组件错误
const handleError = (error, component) => {
  handleComponentError(error, component, {
    fallback: ErrorComponent,
    reportToServer: true,
    showUserMessage: true,
    retryCount: 0,
    maxRetries: 3
  })
}

// 在组件中使用
<EwVueComponent 
  :is="currentComponent"
  @error="handleError"
/>
```

## 性能监控

### createPerformanceMonitor

创建一个性能监控器。

```typescript
function createPerformanceMonitor(options?: PerformanceOptions): PerformanceMonitor
```

**参数:**
- `options`: 性能监控配置

```typescript
interface PerformanceOptions {
  enabled?: boolean
  threshold?: number
  onSlowRender?: (duration: number, component: any) => void
  onError?: (error: Error) => void
}
```

**返回值:**
- `PerformanceMonitor`: 性能监控器实例

**示例:**

```javascript
import { createPerformanceMonitor } from 'ew-vue-component'

// 创建性能监控器
const performanceMonitor = createPerformanceMonitor({
  enabled: true,
  threshold: 100, // 100ms
  onSlowRender: (duration, component) => {
    console.warn(`组件渲染过慢: ${duration.toFixed(2)}ms`, component)
  },
  onError: (error) => {
    console.error('性能监控错误:', error)
  }
})

// 监控组件渲染
performanceMonitor.start('my-component')
// ... 组件渲染
performanceMonitor.end('my-component')
```

### PerformanceMonitor 接口

```typescript
interface PerformanceMonitor {
  start(name: string): void
  end(name: string): number
  measure(name: string, startName: string, endName: string): PerformanceMeasure
  getMeasures(): PerformanceMeasure[]
  clear(): void
}
```

## 类型工具

### ComponentType

组件类型联合类型。

```typescript
type ComponentType = string | Component | ComponentObject | (() => Promise<Component>)
```

### ComponentObject

组件对象接口。

```typescript
interface ComponentObject {
  render: () => VNode
  name?: string
  props?: Record<string, any>
  emits?: string[]
  setup?: () => any
}
```

### Plugin

插件接口。

```typescript
interface Plugin {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}
```

### PluginContext

插件上下文接口。

```typescript
interface PluginContext {
  component: any
  data: Record<string, any>
  utils: {
    warn: (message: string) => void
    log: (message: string, data?: any) => void
  }
}
```

## 使用示例

### 完整的工具函数使用示例

```javascript
import { 
  isComponent,
  createComponent,
  createAsyncComponent,
  createCache,
  createPlugin,
  createPluginManager,
  createErrorBoundary,
  createPerformanceMonitor,
  h
} from 'ew-vue-component'

// 1. 验证组件
const validateComponent = (component) => {
  if (!isComponent(component)) {
    throw new Error('无效的组件类型')
  }
  return true
}

// 2. 创建组件
const MyComponent = createComponent({
  name: 'MyComponent',
  props: ['title'],
  render() {
    return h('div', { class: 'my-component' }, this.title)
  }
})

// 3. 创建异步组件
const AsyncComponent = createAsyncComponent(
  () => import('./AsyncComponent.vue'),
  {
    loadingComponent: LoadingSpinner,
    errorComponent: ErrorDisplay,
    delay: 200
  }
)

// 4. 创建缓存
const cache = createCache({ maxSize: 50, ttl: 300000 })
cache.set('my-component', MyComponent)

// 5. 创建插件
const logPlugin = createPlugin({
  name: 'log',
  beforeRender: (component, props) => {
    console.log('渲染前:', component.name, props)
  }
})

// 6. 创建插件管理器
const pluginManager = createPluginManager()
pluginManager.register('log', logPlugin)

// 7. 创建错误边界
const ErrorBoundary = createErrorBoundary({
  fallback: (error) => h('div', { class: 'error' }, error.message)
})

// 8. 创建性能监控
const performanceMonitor = createPerformanceMonitor({
  threshold: 100,
  onSlowRender: (duration) => {
    console.warn(`渲染过慢: ${duration}ms`)
  }
})

// 9. 在组件中使用
export default {
  setup() {
    const currentComponent = ref(MyComponent)
    
    const handleError = (error) => {
      console.error('组件错误:', error)
    }
    
    return {
      currentComponent,
      handleError,
      plugins: pluginManager.create({ log: { enabled: true } }),
      cache,
      performanceMonitor
    }
  },
  
  template: `
    <ErrorBoundary>
      <EwVueComponent 
        :is="currentComponent"
        :plugins="plugins"
        @error="handleError"
      />
    </ErrorBoundary>
  `
}
```

## 注意事项

1. **类型安全**: 使用 TypeScript 时，确保导入正确的类型定义
2. **性能考虑**: 缓存和性能监控工具会影响性能，合理使用
3. **错误处理**: 始终提供错误处理机制，避免应用崩溃
4. **插件管理**: 合理组织插件，避免插件冲突
5. **内存管理**: 及时清理缓存和监控数据，避免内存泄漏

## 下一步

- 查看 [组件 API](/zh-CN/api/component) 了解组件功能
- 浏览 [插件 API](/zh-CN/api/plugin) 了解插件系统
- 参考 [最佳实践](/zh-CN/guide/best-practices) 学习使用技巧 