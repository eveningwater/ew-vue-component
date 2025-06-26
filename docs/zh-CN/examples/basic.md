# 基础示例

## 动态切换 HTML 标签

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToDiv">切换到 Div</button>
      <button @click="switchToSpan">切换到 Span</button>
      <button @click="switchToButton">切换到 Button</button>
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

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f8fafc;
}

.demo-element {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.div-style {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.span-style {
  background: #fef3c7;
  border-color: #f59e0b;
  display: inline-block;
}

.button-style {
  background: #dcfce7;
  border-color: #22c55e;
  cursor: pointer;
}

.button-style:hover {
  background: #bbf7d0;
}
</style>
```

## 组件对象渲染

```vue
<template>
  <div class="demo">
    <button @click="toggleComponent">切换组件</button>
    
    <EwVueComponent :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const isFirstComponent = ref(true)

const firstComponent = {
  render() {
    return h('div', { class: 'component-a' }, [
      h('h3', '组件 A'),
      h('p', '这是一个通过 render 函数创建的组件'),
      h('button', { onClick: () => alert('来自组件 A') }, '点击我')
    ])
  }
}

const secondComponent = {
  render() {
    return h('div', { class: 'component-b' }, [
      h('h3', '组件 B'),
      h('p', '这是另一个通过 render 函数创建的组件'),
      h('input', { 
        placeholder: '输入一些内容',
        onInput: (e) => console.log('输入:', e.target.value)
      })
    ])
  }
}

const currentComponent = ref(firstComponent)

const toggleComponent = () => {
  isFirstComponent.value = !isFirstComponent.value
  currentComponent.value = isFirstComponent.value ? firstComponent : secondComponent
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.demo button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.component-a {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #0ea5e9;
}

.component-a h3 {
  color: #0c4a6e;
  margin: 0 0 0.5rem 0;
}

.component-a button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.component-b {
  background: #fef3c7;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #f59e0b;
}

.component-b h3 {
  color: #92400e;
  margin: 0 0 0.5rem 0;
}

.component-b input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #f59e0b;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}
</style>
```

## 异步组件加载

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadUserProfile">加载用户资料</button>
      <button @click="loadSettings">加载设置</button>
      <button @click="loadDashboard">加载仪表板</button>
    </div>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <EwVueComponent 
      v-else
      :is="currentAsyncComponent" 
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentAsyncComponent = ref(null)
const loading = ref(false)

const loadUserProfile = async () => {
  loading.value = true
  try {
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentAsyncComponent.value = () => import('./UserProfile.vue')
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const loadSettings = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    currentAsyncComponent.value = () => import('./Settings.vue')
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const loadDashboard = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    currentAsyncComponent.value = () => import('./Dashboard.vue')
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
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f8fafc;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-style: italic;
}
</style>
``` 