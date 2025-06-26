# 快速开始

## 安装

使用 npm 安装：

```bash
npm install ew-vue-component
```

使用 yarn 安装：

```bash
yarn add ew-vue-component
```

使用 pnpm 安装：

```bash
pnpm add ew-vue-component
```

## 基础用法

### 1. 全局注册

```js
import { createApp } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import App from './App.vue'

const app = createApp(App)
app.component('EwVueComponent', EwVueComponent)
app.mount('#app')
```

### 2. 局部注册

```vue
<template>
  <EwVueComponent :is="currentComponent" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
</script>
```

### 3. 基本示例

```vue
<template>
  <div>
    <button @click="switchComponent">切换组件</button>
    <EwVueComponent 
      :is="currentComponent" 
      :class="componentClass"
      @error="handleError"
    >
      <template #default>
        <p>这是插槽内容</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const componentClass = ref('my-component')

const switchComponent = () => {
  currentComponent.value = currentComponent.value === 'div' ? 'span' : 'div'
}

const handleError = (error) => {
  console.error('组件加载失败:', error)
}
</script>
```

## 支持的组件类型

EwVueComponent 支持多种组件类型：

### 1. HTML 标签

```vue
<template>
  <EwVueComponent is="div" class="container">
    <p>这是一个 div 元素</p>
  </EwVueComponent>
</template>
```

### 2. Vue 组件

```vue
<template>
  <EwVueComponent :is="MyComponent" :title="title" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import MyComponent from './MyComponent.vue'

const title = ref('Hello World')
</script>
```

### 3. 异步组件

```vue
<template>
  <EwVueComponent :is="asyncComponent" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const asyncComponent = ref(() => import('./AsyncComponent.vue'))
</script>
```

### 4. 组件对象

```vue
<template>
  <EwVueComponent :is="componentObject" />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const componentObject = ref({
  render() {
    return h('div', { class: 'custom-component' }, '动态创建的组件')
  }
})
</script>
```

## Props 透传

EwVueComponent 会自动透传所有 props（除了 `is`）：

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    @click="handleClick"
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
</script>
```

## 插槽支持

支持默认插槽和具名插槽：

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
    
    <template #footer>
      <p>底部内容</p>
    </template>
  </EwVueComponent>
</template>
```

## 错误处理

当组件加载失败时，会触发 `error` 事件：

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

const currentComponent = ref('NonExistentComponent')

const handleError = (error) => {
  console.error('组件错误:', error)
  // 可以在这里设置备用组件
  currentComponent.value = 'div'
}
</script>
```

## 下一步

- 查看 [API 文档](/zh-CN/api/) 了解完整的 API 参考
- 浏览 [示例](/zh-CN/examples/) 学习更多用法
- 了解 [高级特性](/zh-CN/guide/advanced-features) 和最佳实践 