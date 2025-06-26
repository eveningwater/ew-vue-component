# EwVueComponent API

## 概述

EwVueComponent 是一个强大的 Vue 3 动态组件包装器，支持多种组件类型的动态切换，包括 HTML 标签、Vue 组件、异步组件和组件对象。

## 基础用法

```vue
<!-- HTML 标签 -->
<EwVueComponent is="div" />

<!-- Vue 组件 -->
<EwVueComponent :is="MyComponent" />

<!-- 组件对象 -->
<EwVueComponent :is="componentObject" />

<!-- 异步组件 -->
<EwVueComponent :is="asyncComponent" />
```

## Props

### is

- **类型**: `string | Component | ComponentObject | (() => Promise<Component>)`
- **必需**: 是
- **描述**: 要渲染的组件类型

```vue
<template>
  <!-- 字符串组件 (HTML 标签) -->
  <EwVueComponent is="div" />
  
  <!-- Vue 组件 -->
  <EwVueComponent :is="MyComponent" />
  
  <!-- 组件对象 -->
  <EwVueComponent :is="componentObject" />
  
  <!-- 异步组件 -->
  <EwVueComponent :is="asyncComponent" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

// Vue 组件
const MyComponent = {
  name: 'MyComponent',
  template: '<div>Hello World</div>'
}

// 组件对象
const componentObject = {
  render() {
    return h('div', 'Hello from render function')
  }
}

// 异步组件
const asyncComponent = () => import('./MyAsyncComponent.vue')
</script>
```

### fallback

- **类型**: `string | Component | ComponentObject`
- **默认值**: `undefined`
- **描述**: 当主组件加载失败时使用的备用组件

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    fallback="div"
  >
    <template #default>
      <p>主要内容</p>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('UnstableComponent')
</script>
```

### errorComponent

- **类型**: `string | Component | ComponentObject`
- **默认值**: `undefined`
- **描述**: 自定义错误组件

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :error-component="ErrorComponent"
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const ErrorComponent = {
  render() {
    return h('div', { class: 'error' }, [
      h('h3', '组件加载失败'),
      h('p', '请稍后重试')
    ])
  }
}
</script>
```

### cache

- **类型**: `boolean`
- **默认值**: `false`
- **描述**: 是否启用组件缓存

### cacheKey

- **类型**: `string`
- **默认值**: `''`
- **描述**: 自定义缓存键名

### cacheTtl

- **类型**: `number`
- **默认值**: `300000` (5分钟)
- **描述**: 缓存生存时间，单位为毫秒

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :cache="true"
    cache-key="my-component"
    :cache-ttl="600000"
  />
</template>
```

### plugins

- **类型**: `Plugin[]`
- **默认值**: `[]`
- **描述**: 要使用的插件数组

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin]"
  />
</template>
```

## Props 和 Attrs 透传

EwVueComponent 会自动透传所有 props（除了 `is`、`fallback`、`errorComponent`）和 attrs 给目标组件：

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    class="my-component"
    data-testid="test-component"
    @click="handleClick"
    @input="handleInput"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('button')
const title = ref('点击我')
const count = ref(0)
const disabled = ref(false)

const handleClick = () => {
  count.value++
}

const handleInput = (value) => {
  console.log('输入:', value)
}
</script>
```

## 插槽透传

EwVueComponent 支持所有类型的插槽透传：

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <!-- 默认插槽 -->
    <template #default>
      <p>默认内容</p>
    </template>
    
    <!-- 具名插槽 -->
    <template #header>
      <h2>头部内容</h2>
    </template>
    
    <!-- 作用域插槽 -->
    <template #item="{ data, index }">
      <div class="item">
        {{ index + 1 }}. {{ data.title }}
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ListItem')
</script>
```

## 事件透传

所有事件都会自动透传给目标组件：

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('input')

const handleClick = (event) => {
  console.log('点击事件:', event)
}

const handleInput = (event) => {
  console.log('输入事件:', event.target.value)
}

const handleChange = (event) => {
  console.log('变化事件:', event.target.value)
}

const handleSubmit = (event) => {
  console.log('提交事件:', event)
  event.preventDefault()
}
</script>
```

## 事件

### error

- **类型**: `(error: Error) => void`
- **描述**: 当组件渲染出错时触发

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const handleError = (error) => {
  console.error('组件错误:', error)
  // 可以在这里处理错误，如显示错误提示、上报错误等
}
</script>
import { EwVueComponent } from 'ew-vue-component'

const componentObject = {
  render() {
    return h('div', 'Cached component')
  }
}

const cacheKey = computed(() => `component-${componentObject.name || 'default'}`)
</script>
```

## 插件系统

EwVueComponent 支持插件扩展：

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
  beforeRender(component, props) {
    console.log('渲染前:', component, props)
  }
}

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props) {
    performance.mark('component-render-start')
  },
  afterRender(component, props) {
    performance.mark('component-render-end')
    performance.measure('component-render', 'component-render-start', 'component-render-end')
  }
}
</script>
```

## 事件

### error

- **类型**: `(error: Error) => void`
- **描述**: 当组件加载或渲染出错时触发

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const handleError = (error) => {
  console.error('组件错误:', error)
  // 可以在这里实现错误处理逻辑
  // 比如降级到备用组件或显示错误信息
}
</script>
```

## 类型定义

```typescript
interface EwVueComponentProps {
  is: string | Component | ComponentObject | (() => Promise<Component>)
  fallback?: string | Component | ComponentObject
  errorComponent?: string | Component | ComponentObject
  cache?: boolean
  cacheKey?: string
  cacheTtl?: number
  plugins?: Plugin[]
}

interface ComponentObject {
  render: () => VNode
  name?: string
  props?: Record<string, any>
  emits?: string[]
}

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

## 注意事项

1. **组件类型**: `is` prop 支持多种组件类型，确保传入正确的类型
2. **错误处理**: 始终监听 `error` 事件并提供合适的降级方案
3. **性能考虑**: 合理使用缓存功能，避免不必要的组件重新渲染
4. **插件开发**: 插件应该遵循单一职责原则，避免副作用
5. **类型安全**: 使用 TypeScript 时，为组件和插件定义正确的类型

## 下一步

- 查看 [插件 API](/zh-CN/api/plugin) 了解插件系统
- 浏览 [工具函数 API](/zh-CN/api/utils) 了解可用的工具函数
- 参考 [最佳实践](/zh-CN/guide/best-practices) 学习使用技巧 