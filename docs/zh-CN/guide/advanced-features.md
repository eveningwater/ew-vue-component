# 高级特性

这里将介绍 EwVueComponent 的高级特性，如异步组件、错误边界、插件扩展等。

> 本文档建设中，敬请期待。 

## 异步组件加载

EwVueComponent 支持异步组件，可以实现按需加载和代码分割：

### 1. 基础异步组件

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">用户资料</button>
      <button @click="loadComponent('Settings')">设置</button>
      <button @click="loadComponent('Dashboard')">仪表板</button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    
    <EwVueComponent 
      v-else-if="currentComponent"
      :is="currentComponent" 
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const loading = ref(false)

const componentMap = {
  UserProfile: () => import('./components/UserProfile.vue'),
  Settings: () => import('./components/Settings.vue'),
  Dashboard: () => import('./components/Dashboard.vue')
}

const loadComponent = async (name) => {
  loading.value = true
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentComponent.value = componentMap[name]
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const handleError = (error) => {
  console.error('异步组件加载失败:', error)
  loading.value = false
}
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

### 2. 带加载状态的异步组件

```vue
<template>
  <div class="demo">
    <button @click="loadHeavyComponent">加载重型组件</button>
    
    <div v-if="loading" class="loading-state">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <p>加载进度: {{ progress }}%</p>
    </div>
    
    <EwVueComponent 
      v-else-if="currentComponent"
      :is="currentComponent" 
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const loading = ref(false)
const progress = ref(0)

const loadHeavyComponent = async () => {
  loading.value = true
  progress.value = 0
  
  // 模拟加载进度
  const progressInterval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(progressInterval)
    }
  }, 100)
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    currentComponent.value = () => import('./components/HeavyComponent.vue')
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
    progress.value = 100
  }
}

const handleError = (error) => {
  console.error('组件加载失败:', error)
  loading.value = false
}
</script>

<style scoped>
.loading-state {
  padding: 2rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}
</style>
```

## 错误边界和降级处理

EwVueComponent 提供了完善的错误处理机制：

### 1. 基础错误处理

```vue
<template>
  <div class="demo">
    <button @click="loadErrorComponent">加载错误组件</button>
    
    <EwVueComponent 
      :is="currentComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const loadErrorComponent = () => {
  // 故意加载一个不存在的组件
  currentComponent.value = 'NonExistentComponent'
}

const handleError = (error) => {
  console.error('组件错误:', error)
  // 降级到默认组件
  currentComponent.value = 'div'
}
</script>
```

### 2. 使用 fallback 组件

```vue
<template>
  <div class="demo">
    <button @click="loadUnstableComponent">加载不稳定组件</button>
    
    <EwVueComponent 
      :is="currentComponent"
      fallback="div"
      @error="handleError"
    >
      <template #default>
        <p>主要内容</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const loadUnstableComponent = () => {
  // 模拟不稳定的组件
  currentComponent.value = Math.random() > 0.5 ? 'UnstableComponent' : 'div'
}

const handleError = (error) => {
  console.error('组件错误，使用 fallback:', error)
}
</script>
```

### 3. 自定义错误组件

```vue
<template>
  <div class="demo">
    <button @click="loadComponent">加载组件</button>
    
    <EwVueComponent 
      :is="currentComponent"
      :error-component="ErrorComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// 自定义错误组件
const ErrorComponent = {
  render() {
    return h('div', { class: 'error-component' }, [
      h('h3', '组件加载失败'),
      h('p', '抱歉，组件暂时无法加载'),
      h('button', { 
        onClick: () => window.location.reload() 
      }, '重新加载')
    ])
  }
}

const loadComponent = () => {
  // 故意加载错误组件
  currentComponent.value = 'BrokenComponent'
}

const handleError = (error) => {
  console.error('使用自定义错误组件:', error)
}
</script>

<style scoped>
.error-component {
  padding: 2rem;
  text-align: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-component button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.error-component button:hover {
  background: #b91c1c;
}
</style>
```

## 插件系统

EwVueComponent 支持插件扩展，可以自定义组件行为：

### 1. 基础插件

```vue
<template>
  <div class="demo">
    <button @click="togglePlugin">切换插件</button>
    
    <EwVueComponent 
      :is="currentComponent"
      :plugins="activePlugins"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const activePlugins = ref([])

// 日志插件
const logPlugin = {
  name: 'log',
  beforeRender(component, props) {
    console.log('渲染前:', component, props)
  },
  afterRender(component, props) {
    console.log('渲染后:', component, props)
  }
}

// 性能监控插件
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

const togglePlugin = () => {
  if (activePlugins.value.length === 0) {
    activePlugins.value = [logPlugin, performancePlugin]
  } else {
    activePlugins.value = []
  }
}
</script>
```

### 2. 自定义插件

```vue
<template>
  <div class="demo">
    <EwVueComponent 
      :is="currentComponent"
      :plugins="[customPlugin]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('button')

// 自定义插件：添加点击计数
const customPlugin = {
  name: 'click-counter',
  data: {
    clickCount: 0
  },
  beforeRender(component, props) {
    // 在渲染前修改 props
    if (component === 'button') {
      props.onClick = (event) => {
        this.data.clickCount++
        console.log(`按钮被点击了 ${this.data.clickCount} 次`)
        if (props.originalOnClick) {
          props.originalOnClick(event)
        }
      }
      props.originalOnClick = props.onClick
    }
  }
}
</script>
```

## 组件缓存

EwVueComponent 支持组件缓存，提升性能：

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToA">组件 A</button>
      <button @click="switchToB">组件 B</button>
      <button @click="clearCache">清除缓存</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :cache="true"
      :cache-key="cacheKey"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref(ComponentA)
const cacheKey = computed(() => `component-${currentComponent.value.name}`)

const switchToA = () => {
  currentComponent.value = ComponentA
}

const switchToB = () => {
  currentComponent.value = ComponentB
}

const clearCache = () => {
  // 清除组件缓存
  // 这里需要调用 EwVueComponent 的缓存清除方法
  console.log('缓存已清除')
}
</script>
```

## 性能优化

### 1. 使用 v-if 优化

```vue
<template>
  <div class="demo">
    <button @click="toggleComponent">切换组件</button>
    
    <EwVueComponent 
      v-if="showComponent"
      :is="currentComponent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const showComponent = ref(true)
const currentComponent = ref('div')

const toggleComponent = () => {
  showComponent.value = !showComponent.value
}
</script>
```

### 2. 使用 keep-alive

```vue
<template>
  <div class="demo">
    <button @click="switchComponent">切换组件</button>
    
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

const currentComponent = ref('ComponentA')

const switchComponent = () => {
  currentComponent.value = currentComponent.value === 'ComponentA' ? 'ComponentB' : 'ComponentA'
}
</script>
```

## 注意事项

1. **异步组件**: 确保异步组件函数返回正确的 Promise
2. **错误处理**: 始终监听 `error` 事件并提供合适的降级方案
3. **性能考虑**: 合理使用缓存和 keep-alive，避免不必要的组件重新渲染
4. **插件开发**: 插件应该遵循单一职责原则，避免副作用
5. **类型安全**: 使用 TypeScript 时，为插件和异步组件定义正确的类型

## 下一步

- 查看 [最佳实践](/zh-CN/guide/best-practices) 学习更多优化技巧
- 浏览 [API 文档](/zh-CN/api/) 了解完整的 API 参考
- 查看 [示例](/zh-CN/examples/) 了解更多使用场景 