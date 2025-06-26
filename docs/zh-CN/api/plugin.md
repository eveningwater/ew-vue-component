# 插件 API

## 概述

EwVueComponent 提供了强大的插件系统，允许开发者扩展组件功能，添加自定义行为，如日志记录、性能监控、错误处理等。

## 插件结构

```typescript
interface Plugin {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}

interface PluginContext {
  component: any
  data: Record<string, any>
  utils: {
    warn: (message: string) => void
    log: (message: string, data?: any) => void
  }
}
```

## 基础插件

### 1. 日志插件

```javascript
const logPlugin = {
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
}
```

### 2. 性能监控插件

```javascript
const performancePlugin = {
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
}
```

### 3. 错误处理插件

```javascript
const errorPlugin = {
  name: 'error-handler',
  
  onError(error, context) {
    // 记录错误到服务器
    this.reportError(error, context)
    
    // 显示用户友好的错误信息
    this.showUserError(error)
  },
  
  reportError(error, context) {
    // 发送错误到错误监控服务
    console.error('错误已上报:', {
      error: error.message,
      stack: error.stack,
      component: context.component,
      timestamp: new Date().toISOString()
    })
  },
  
  showUserError(error) {
    // 显示用户友好的错误提示
    console.warn('组件加载失败，请稍后重试')
  }
}
```

## 使用插件

### 1. 基础用法

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin]"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const logPlugin = {
  name: 'log',
  beforeRender(component, props, context) {
    console.log('渲染前:', component, props)
  },
  afterRender(component, props, context) {
    console.log('渲染后:', component, props)
  }
}

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark('component-render-start')
  },
  afterRender(component, props, context) {
    performance.mark('component-render-end')
    performance.measure('component-render', 'component-render-start', 'component-render-end')
  }
}
</script>
```

### 2. 动态插件管理

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        <input v-model="enableLogging" type="checkbox" />
        启用日志
      </label>
      <label>
        <input v-model="enablePerformance" type="checkbox" />
        启用性能监控
      </label>
      <label>
        <input v-model="enableErrorHandling" type="checkbox" />
        启用错误处理
      </label>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :plugins="activePlugins"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const enableLogging = ref(true)
const enablePerformance = ref(false)
const enableErrorHandling = ref(true)

const logPlugin = {
  name: 'log',
  beforeRender(component, props, context) {
    console.log('渲染前:', component, props)
  },
  afterRender(component, props, context) {
    console.log('渲染后:', component, props)
  }
}

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark('component-render-start')
  },
  afterRender(component, props, context) {
    performance.mark('component-render-end')
    performance.measure('component-render', 'component-render-start', 'component-render-end')
  }
}

const errorPlugin = {
  name: 'error-handler',
  onError(error, context) {
    console.error('组件错误:', error)
  }
}

const activePlugins = computed(() => {
  const plugins = []
  
  if (enableLogging.value) plugins.push(logPlugin)
  if (enablePerformance.value) plugins.push(performancePlugin)
  if (enableErrorHandling.value) plugins.push(errorPlugin)
  
  return plugins
})
</script>
```

### 3. 插件配置

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="configuredPlugins"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// 可配置的日志插件
const createLogPlugin = (options = {}) => ({
  name: 'log',
  beforeRender(component, props, context) {
    if (options.logBefore) {
      console.log('渲染前:', component, props)
    }
  },
  afterRender(component, props, context) {
    if (options.logAfter) {
      console.log('渲染后:', component, props)
    }
  },
  onError(error, context) {
    if (options.logErrors) {
      console.error('错误:', error)
    }
  }
})

const configuredPlugins = [
  createLogPlugin({ logBefore: true, logAfter: true, logErrors: true }),
  createPerformancePlugin({ measureTime: true })
]
</script>
```

## 高级插件

### 1. 状态管理插件

```javascript
const statePlugin = {
  name: 'state-manager',
  
  install(context) {
    // 初始化插件状态
    context.data.state = {
      renderCount: 0,
      lastRenderTime: null,
      errors: []
    }
  },
  
  beforeRender(component, props, context) {
    context.data.state.renderCount++
    context.data.state.lastRenderTime = new Date()
  },
  
  onError(error, context) {
    context.data.state.errors.push({
      message: error.message,
      timestamp: new Date(),
      component: context.component
    })
  },
  
  uninstall(context) {
    // 清理插件状态
    console.log('插件状态:', context.data.state)
    delete context.data.state
  }
}
```

### 2. 缓存插件

```javascript
const cachePlugin = {
  name: 'cache-manager',
  
  install(context) {
    context.data.cache = new Map()
  },
  
  beforeRender(component, props, context) {
    const cacheKey = this.generateCacheKey(component, props)
    
    if (context.data.cache.has(cacheKey)) {
      // 使用缓存的结果
      const cachedResult = context.data.cache.get(cacheKey)
      context.utils.log('使用缓存结果:', cachedResult)
      return cachedResult
    }
  },
  
  afterRender(component, props, context) {
    const cacheKey = this.generateCacheKey(component, props)
    const result = { component, props, timestamp: Date.now() }
    
    context.data.cache.set(cacheKey, result)
    context.utils.log('缓存结果:', result)
  },
  
  generateCacheKey(component, props) {
    return `${component.name || component}-${JSON.stringify(props)}`
  },
  
  uninstall(context) {
    context.data.cache.clear()
  }
}
```

### 3. 验证插件

```javascript
const validationPlugin = {
  name: 'validator',
  
  beforeRender(component, props, context) {
    // 验证组件类型
    if (!this.isValidComponent(component)) {
      throw new Error(`无效的组件类型: ${component}`)
    }
    
    // 验证必需的 props
    if (component.props) {
      this.validateProps(component.props, props)
    }
  },
  
  isValidComponent(component) {
    return typeof component === 'string' || 
           typeof component === 'function' || 
           (typeof component === 'object' && component.render)
  },
  
  validateProps(requiredProps, providedProps) {
    for (const [key, prop] of Object.entries(requiredProps)) {
      if (prop.required && !(key in providedProps)) {
        throw new Error(`缺少必需的 prop: ${key}`)
      }
    }
  }
}
```

## 插件组合

### 1. 插件工厂

```javascript
// plugins/factory.js
export const createPluginFactory = () => {
  const plugins = new Map()
  
  return {
    register(name, plugin) {
      plugins.set(name, plugin)
    },
    
    get(name) {
      return plugins.get(name)
    },
    
    create(config) {
      return Object.entries(config).map(([name, options]) => {
        const plugin = plugins.get(name)
        if (!plugin) {
          throw new Error(`插件未找到: ${name}`)
        }
        return typeof plugin === 'function' ? plugin(options) : plugin
      })
    }
  }
}

// 使用示例
const factory = createPluginFactory()

factory.register('log', (options) => ({
  name: 'log',
  beforeRender(component, props, context) {
    if (options.enabled) {
      console.log('渲染前:', component, props)
    }
  }
}))

factory.register('performance', performancePlugin)

const plugins = factory.create({
  log: { enabled: true },
  performance: {}
})
```

### 2. 插件链

```javascript
const pluginChain = {
  name: 'plugin-chain',
  
  install(context) {
    context.data.pluginChain = []
  },
  
  beforeRender(component, props, context) {
    // 执行插件链
    for (const plugin of context.data.pluginChain) {
      if (plugin.beforeRender) {
        plugin.beforeRender(component, props, context)
      }
    }
  },
  
  afterRender(component, props, context) {
    // 反向执行插件链
    for (let i = context.data.pluginChain.length - 1; i >= 0; i--) {
      const plugin = context.data.pluginChain[i]
      if (plugin.afterRender) {
        plugin.afterRender(component, props, context)
      }
    }
  },
  
  addPlugin(plugin, context) {
    context.data.pluginChain.push(plugin)
  },
  
  removePlugin(pluginName, context) {
    const index = context.data.pluginChain.findIndex(p => p.name === pluginName)
    if (index > -1) {
      context.data.pluginChain.splice(index, 1)
    }
  }
}
```

## 最佳实践

### 1. 插件设计原则

```javascript
// 好的插件设计
const goodPlugin = {
  name: 'good-plugin',
  
  // 单一职责
  beforeRender(component, props, context) {
    // 只做一件事
    this.validateComponent(component)
  },
  
  // 无副作用
  validateComponent(component) {
    if (!component) {
      throw new Error('组件不能为空')
    }
  }
}

// 避免的设计
const badPlugin = {
  name: 'bad-plugin',
  
  beforeRender(component, props, context) {
    // 不要做太多事情
    this.validateComponent(component)
    this.logComponent(component)
    this.cacheComponent(component)
    this.transformProps(props)
    // ...
  }
}
```

### 2. 错误处理

```javascript
const safePlugin = {
  name: 'safe-plugin',
  
  beforeRender(component, props, context) {
    try {
      this.doSomething(component, props)
    } catch (error) {
      // 不要阻止组件渲染
      context.utils.warn(`插件错误: ${error.message}`)
    }
  },
  
  onError(error, context) {
    // 处理组件错误
    console.error('组件错误:', error)
  }
}
```

### 3. 性能优化

```javascript
const optimizedPlugin = {
  name: 'optimized-plugin',
  
  install(context) {
    // 缓存计算结果
    context.data.cache = new WeakMap()
  },
  
  beforeRender(component, props, context) {
    // 使用缓存避免重复计算
    const cacheKey = { component, props }
    if (context.data.cache.has(cacheKey)) {
      return context.data.cache.get(cacheKey)
    }
    
    const result = this.expensiveOperation(component, props)
    context.data.cache.set(cacheKey, result)
    return result
  },
  
  expensiveOperation(component, props) {
    // 昂贵的操作
    return { processed: true }
  }
}
```

## 注意事项

1. **插件顺序**: 插件的执行顺序很重要，确保依赖关系正确
2. **错误处理**: 插件错误不应该阻止组件渲染
3. **性能考虑**: 避免在插件中执行昂贵的操作
4. **内存管理**: 及时清理插件资源，避免内存泄漏
5. **类型安全**: 使用 TypeScript 定义插件接口

## 下一步

- 查看 [组件 API](/zh-CN/api/component) 了解组件功能
- 浏览 [工具函数 API](/zh-CN/api/utils) 了解可用的工具函数
- 参考 [最佳实践](/zh-CN/guide/best-practices) 学习使用技巧 