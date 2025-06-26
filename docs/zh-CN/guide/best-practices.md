# 最佳实践

## 性能优化

### 1. 合理使用 v-if 和 keep-alive

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="showComponent = !showComponent">切换显示</button>
      <button @click="switchComponent">切换组件</button>
    </div>
    
    <!-- 使用 v-if 避免不必要的渲染 -->
    <EwVueComponent 
      v-if="showComponent"
      :is="currentComponent"
    />
    
    <!-- 使用 keep-alive 保持组件状态 -->
    <keep-alive>
      <EwVueComponent 
        :is="currentComponent"
        :key="currentComponent"
      />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const showComponent = ref(true)
const currentComponent = ref('ComponentA')

const switchComponent = () => {
  currentComponent.value = currentComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA'
}
</script>
```

### 2. 异步组件懒加载

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">用户资料</button>
      <button @click="loadComponent('Settings')">设置</button>
      <button @click="loadComponent('Dashboard')">仪表板</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

// 使用 shallowRef 避免深层响应式
const currentComponent = shallowRef(null)

// 组件映射表，按需加载
const componentMap = {
  UserProfile: () => import('./components/UserProfile.vue'),
  Settings: () => import('./components/Settings.vue'),
  Dashboard: () => import('./components/Dashboard.vue')
}

const loadComponent = async (name) => {
  try {
    currentComponent.value = componentMap[name]
  } catch (error) {
    handleError(error)
  }
}

const handleError = (error) => {
  console.error('组件加载失败:', error)
  // 降级到默认组件
  currentComponent.value = 'div'
}
</script>
```

### 3. 组件缓存策略

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchComponent">切换组件</button>
      <button @click="clearCache">清除缓存</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :cache="true"
      :cache-key="cacheKey"
      :cache-ttl="300000" <!-- 5分钟缓存 -->
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ComponentA')

// 生成缓存键
const cacheKey = computed(() => {
  return `component-${currentComponent.value}-${Date.now()}`
})

const switchComponent = () => {
  currentComponent.value = currentComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA'
}

const clearCache = () => {
  // 清除组件缓存
  // 这里需要调用 EwVueComponent 的缓存清除方法
  console.log('缓存已清除')
}
</script>
```

## 类型安全

### 1. TypeScript 类型定义

```typescript
// types/ew-component.ts
import type { Component, ComponentPublicInstance } from 'vue'

export interface EwVueComponentProps {
  is: string | Component | ComponentObject | (() => Promise<Component>)
  fallback?: string | Component | ComponentObject
  errorComponent?: string | Component | ComponentObject
  cache?: boolean
  cacheKey?: string
  cacheTtl?: number
  plugins?: Plugin[]
}

export interface ComponentObject {
  render: () => VNode
  name?: string
}

export interface Plugin {
  name: string
  beforeRender?: (component: any, props: any) => void
  afterRender?: (component: any, props: any) => void
  onError?: (error: Error) => void
}

export interface EwVueComponentEmits {
  error: [error: Error]
}
```

### 2. 使用类型安全的组件

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="fallbackComponent"
    :error-component="errorComponent"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import type { Component } from 'vue'

// 类型安全的组件定义
const currentComponent = ref<Component | string>('div')
const fallbackComponent = ref<Component | string>('div')
const errorComponent = ref<Component | string>('div')

const handleError = (error: Error) => {
  console.error('组件错误:', error)
}
</script>
```

### 3. 泛型组件支持

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    v-bind="componentProps"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

interface ComponentProps {
  title: string
  count: number
  disabled: boolean
}

const currentComponent = ref<string | Component>('button')
const componentProps = reactive<ComponentProps>({
  title: '点击我',
  count: 0,
  disabled: false
})

const handleUpdate = (data: any) => {
  console.log('组件更新:', data)
}
</script>
```

## 插槽设计

### 1. 灵活的插槽结构

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <!-- 默认插槽 -->
    <template #default>
      <div class="content">
        <h2>主要内容</h2>
        <p>这是默认插槽的内容</p>
      </div>
    </template>
    
    <!-- 具名插槽 -->
    <template #header>
      <header class="header">
        <h1>页面标题</h1>
        <nav>导航菜单</nav>
      </header>
    </template>
    
    <template #sidebar>
      <aside class="sidebar">
        <ul>
          <li>菜单项 1</li>
          <li>菜单项 2</li>
          <li>菜单项 3</li>
        </ul>
      </aside>
    </template>
    
    <template #footer>
      <footer class="footer">
        <p>页脚信息</p>
      </footer>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('Layout')
</script>
```

### 2. 作用域插槽

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #default="{ items, loading, error }">
      <div class="list-container">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <ul v-else class="list">
          <li v-for="item in items" :key="item.id" class="list-item">
            {{ item.name }}
          </li>
        </ul>
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('DataList')
</script>
```

### 3. 插槽验证

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #default="{ data, validate }">
      <div class="form-container">
        <input v-model="data.name" placeholder="姓名" />
        <input v-model="data.email" placeholder="邮箱" />
        <button @click="validate">验证</button>
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('FormComponent')
</script>
```

## 错误处理

### 1. 分层错误处理

```vue
<template>
  <div class="app">
    <!-- 全局错误边界 -->
    <EwVueComponent 
      :is="currentComponent"
      :error-component="GlobalErrorComponent"
      @error="handleGlobalError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('AppComponent')

// 全局错误组件
const GlobalErrorComponent = {
  render() {
    return h('div', { class: 'global-error' }, [
      h('h2', '应用出现错误'),
      h('p', '请刷新页面或联系管理员'),
      h('button', { 
        onClick: () => window.location.reload() 
      }, '刷新页面')
    ])
  }
}

const handleGlobalError = (error) => {
  console.error('全局错误:', error)
  // 可以发送错误日志到服务器
  // sendErrorToServer(error)
}
</script>
```

### 2. 优雅降级

```vue
<template>
  <div class="demo">
    <EwVueComponent 
      :is="currentComponent"
      :fallback="fallbackComponent"
      :error-component="errorComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ComplexComponent')
const fallbackComponent = ref('SimpleComponent')
const errorComponent = ref('ErrorComponent')

const handleError = (error) => {
  console.error('组件错误:', error)
  
  // 根据错误类型选择不同的降级策略
  if (error.name === 'NetworkError') {
    currentComponent.value = 'OfflineComponent'
  } else if (error.name === 'ComponentNotFound') {
    currentComponent.value = fallbackComponent.value
  } else {
    currentComponent.value = errorComponent.value
  }
}
</script>
```

### 3. 错误恢复

```vue
<template>
  <div class="demo">
    <EwVueComponent 
      :is="currentComponent"
      @error="handleError"
    />
    
    <div v-if="showRetry" class="retry-container">
      <p>组件加载失败</p>
      <button @click="retryLoad">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('TargetComponent')
const showRetry = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const handleError = (error) => {
  console.error('组件错误:', error)
  
  if (retryCount.value < maxRetries) {
    showRetry.value = true
  } else {
    // 超过最大重试次数，使用降级组件
    currentComponent.value = 'FallbackComponent'
  }
}

const retryLoad = () => {
  retryCount.value++
  showRetry.value = false
  
  // 重新加载组件
  currentComponent.value = 'TargetComponent'
}
</script>
```

## 代码组织

### 1. 组件映射表

```javascript
// components/index.js
export const componentMap = {
  // 基础组件
  div: 'div',
  span: 'span',
  button: 'button',
  input: 'input',
  
  // 业务组件
  UserProfile: () => import('./UserProfile.vue'),
  Settings: () => import('./Settings.vue'),
  Dashboard: () => import('./Dashboard.vue'),
  
  // 动态组件
  DynamicForm: () => import('./DynamicForm.vue'),
  DataTable: () => import('./DataTable.vue'),
  Chart: () => import('./Chart.vue')
}

// 组件验证
export const validateComponent = (name) => {
  return componentMap.hasOwnProperty(name)
}

// 获取组件
export const getComponent = (name) => {
  if (validateComponent(name)) {
    return componentMap[name]
  }
  throw new Error(`Component "${name}" not found`)
}
```

### 2. 插件管理

```javascript
// plugins/index.js
import { logPlugin } from './log'
import { performancePlugin } from './performance'
import { errorPlugin } from './error'

export const plugins = {
  log: logPlugin,
  performance: performancePlugin,
  error: errorPlugin
}

export const createPluginConfig = (pluginNames = []) => {
  return pluginNames.map(name => {
    if (plugins[name]) {
      return plugins[name]
    }
    console.warn(`Plugin "${name}" not found`)
    return null
  }).filter(Boolean)
}
```

### 3. 工具函数

```javascript
// utils/component.js
export const isAsyncComponent = (component) => {
  return typeof component === 'function' && component.toString().includes('import')
}

export const isComponentObject = (component) => {
  return typeof component === 'object' && component.render
}

export const isStringComponent = (component) => {
  return typeof component === 'string'
}

export const validateComponent = (component) => {
  return isAsyncComponent(component) || 
         isComponentObject(component) || 
         isStringComponent(component)
}
```

## 测试策略

### 1. 单元测试

```javascript
// tests/ew-component.test.js
import { mount } from '@vue/test-utils'
import { EwVueComponent } from 'ew-vue-component'

describe('EwVueComponent', () => {
  it('should render HTML tag', () => {
    const wrapper = mount(EwVueComponent, {
      props: { is: 'div' }
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })
  
  it('should handle component switching', async () => {
    const wrapper = mount(EwVueComponent, {
      props: { is: 'div' }
    })
    
    await wrapper.setProps({ is: 'span' })
    expect(wrapper.element.tagName).toBe('SPAN')
  })
  
  it('should handle errors', async () => {
    const onError = jest.fn()
    const wrapper = mount(EwVueComponent, {
      props: { 
        is: 'NonExistentComponent',
        onError 
      }
    })
    
    await wrapper.vm.$nextTick()
    expect(onError).toHaveBeenCalled()
  })
})
```

### 2. 集成测试

```javascript
// tests/integration.test.js
import { mount } from '@vue/test-utils'
import { EwVueComponent } from 'ew-vue-component'

describe('EwVueComponent Integration', () => {
  it('should work with async components', async () => {
    const asyncComponent = () => import('./TestComponent.vue')
    const wrapper = mount(EwVueComponent, {
      props: { is: asyncComponent }
    })
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.test-component').exists()).toBe(true)
  })
  
  it('should handle props forwarding', () => {
    const wrapper = mount(EwVueComponent, {
      props: { 
        is: 'button',
        title: 'Test Button',
        disabled: true
      }
    })
    
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Test Button')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
```

## 注意事项

1. **性能优先**: 合理使用缓存、懒加载和 keep-alive
2. **类型安全**: 使用 TypeScript 定义清晰的类型
3. **错误处理**: 提供完善的错误边界和降级方案
4. **代码组织**: 使用组件映射表和插件系统
5. **测试覆盖**: 编写单元测试和集成测试
6. **文档维护**: 保持文档和代码同步更新

## 下一步

- 查看 [API 文档](/zh-CN/api/) 了解完整的 API 参考
- 浏览 [示例](/zh-CN/examples/) 了解更多使用场景
- 参考 [高级特性](/zh-CN/guide/advanced-features) 学习更多功能 