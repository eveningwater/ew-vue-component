# 基础用法

这里将介绍 EwVueComponent 的基础用法，包括如何动态切换组件、props 透传、插槽等。

> 本文档建设中，敬请期待。

## 动态组件切换

EwVueComponent 的核心功能是动态切换组件。通过 `is` prop 可以传入不同类型的组件：

### 1. HTML 标签切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToDiv">Div</button>
      <button @click="switchToSpan">Span</button>
      <button @click="switchToButton">Button</button>
    </div>
    
    <EwVueComponent 
      :is="currentTag" 
      :class="tagClass"
      @click="handleClick"
    >
      当前标签: {{ currentTag }}
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentTag = ref('div')
const tagClass = ref('demo-element')

const switchToDiv = () => {
  currentTag.value = 'div'
  tagClass.value = 'demo-element div-style'
}

const switchToSpan = () => {
  currentTag.value = 'span'
  tagClass.value = 'demo-element span-style'
}

const switchToButton = () => {
  currentTag.value = 'button'
  tagClass.value = 'demo-element button-style'
}

const handleClick = () => {
  console.log('点击了:', currentTag.value)
}
</script>
```

### 2. Vue 组件切换

```vue
<template>
  <div class="demo">
    <button @click="toggleComponent">切换组件</button>
    
    <EwVueComponent 
      :is="currentComponent" 
      :title="title"
      :count="count"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref(ComponentA)
const title = ref('动态标题')
const count = ref(0)

const toggleComponent = () => {
  currentComponent.value = currentComponent.value === ComponentA ? ComponentB : ComponentA
}

const handleUpdate = (newCount) => {
  count.value = newCount
}
</script>
```

### 3. 异步组件切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadUserProfile">用户资料</button>
      <button @click="loadSettings">设置</button>
      <button @click="loadDashboard">仪表板</button>
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

## Props 透传

EwVueComponent 会自动透传所有 props（除了 `is`）给目标组件：

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    :class="componentClass"
    :style="componentStyle"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('button')
const title = ref('点击我')
const count = ref(0)
const disabled = ref(false)
const componentClass = ref('my-button')
const componentStyle = ref({ color: 'blue' })

const handleClick = () => {
  count.value++
}

const handleInput = (value) => {
  console.log('输入:', value)
}

const handleChange = (value) => {
  console.log('变化:', value)
}
</script>
```

## 插槽支持

支持默认插槽和具名插槽，会自动透传给目标组件：

### 1. 默认插槽

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <p>这是默认插槽的内容</p>
    <span>可以包含多个元素</span>
  </EwVueComponent>
</template>
```

### 2. 具名插槽

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #header>
      <h2>头部内容</h2>
      <p>头部描述</p>
    </template>
    
    <template #default>
      <p>默认内容</p>
      <div>主要内容区域</div>
    </template>
    
    <template #footer>
      <p>底部内容</p>
      <button>操作按钮</button>
    </template>
    
    <template #sidebar>
      <nav>侧边导航</nav>
    </template>
  </EwVueComponent>
</template>
```

### 3. 作用域插槽

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #default="{ data, index }">
      <div class="item">
        <span>{{ index + 1 }}. {{ data.title }}</span>
        <button @click="handleItemClick(data)">操作</button>
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ListItem')

const handleItemClick = (data) => {
  console.log('点击了项目:', data)
}
</script>
```

## 事件处理

EwVueComponent 会自动透传所有事件给目标组件：

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
    @submit="handleSubmit"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
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

const handleFocus = (event) => {
  console.log('获得焦点:', event)
}

const handleBlur = (event) => {
  console.log('失去焦点:', event)
}

const handleKeydown = (event) => {
  console.log('按键事件:', event.key)
}

const handleMouseEnter = (event) => {
  console.log('鼠标进入:', event)
}

const handleMouseLeave = (event) => {
  console.log('鼠标离开:', event)
}
</script>
```

## 响应式更新

EwVueComponent 完全支持 Vue 3 的响应式系统：

```vue
<template>
  <div class="demo">
    <div class="controls">
      <input v-model="componentName" placeholder="输入组件名" />
      <input v-model="componentProps.title" placeholder="输入标题" />
      <input v-model.number="componentProps.count" type="number" placeholder="输入数量" />
      <label>
        <input v-model="componentProps.disabled" type="checkbox" />
        禁用状态
      </label>
    </div>
    
    <EwVueComponent 
      :is="componentName"
      v-bind="componentProps"
      @click="handleClick"
    >
      <template #default>
        <p>当前组件: {{ componentName }}</p>
        <p>标题: {{ componentProps.title }}</p>
        <p>数量: {{ componentProps.count }}</p>
        <p>状态: {{ componentProps.disabled ? '禁用' : '启用' }}</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const componentName = ref('div')
const componentProps = reactive({
  title: '动态标题',
  count: 0,
  disabled: false
})

const handleClick = () => {
  if (!componentProps.disabled) {
    componentProps.count++
  }
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.controls input {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
```

## 注意事项

1. **组件类型**: `is` prop 支持字符串、组件对象、异步组件函数等多种类型
2. **Props 透传**: 除了 `is` 之外的所有 props 都会透传给目标组件
3. **事件透传**: 所有事件都会透传给目标组件
4. **插槽透传**: 所有插槽都会透传给目标组件
5. **响应式**: 完全支持 Vue 3 的响应式系统
6. **类型安全**: 建议使用 TypeScript 以获得更好的类型提示

## 下一步

- 查看 [高级特性](/zh-CN/guide/advanced-features) 了解异步组件、错误处理等
- 浏览 [API 文档](/zh-CN/api/) 了解完整的 API 参考
- 查看 [最佳实践](/zh-CN/guide/best-practices) 学习性能优化和设计模式 