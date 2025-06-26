# 动态组件切换示例

## 基础动态切换

### 1. HTML 标签切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToDiv">Div</button>
      <button @click="switchToSpan">Span</button>
      <button @click="switchToButton">Button</button>
      <button @click="switchToInput">Input</button>
    </div>
    
    <EwVueComponent 
      :is="currentTag" 
      :class="tagClass"
      :placeholder="placeholder"
      @click="handleClick"
      @input="handleInput"
    >
      {{ content }}
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentTag = ref('div')
const content = ref('当前标签内容')

const tagClass = computed(() => `demo-element ${currentTag.value}-style`)
const placeholder = computed(() => currentTag.value === 'input' ? '请输入内容' : '')

const switchToDiv = () => {
  currentTag.value = 'div'
  content.value = '这是一个 div 元素'
}

const switchToSpan = () => {
  currentTag.value = 'span'
  content.value = '这是一个 span 元素'
}

const switchToButton = () => {
  currentTag.value = 'button'
  content.value = '点击我'
}

const switchToInput = () => {
  currentTag.value = 'input'
  content.value = ''
}

const handleClick = () => {
  console.log('点击了:', currentTag.value)
  if (currentTag.value === 'button') {
    alert('按钮被点击了！')
  }
}

const handleInput = (event) => {
  if (currentTag.value === 'input') {
    content.value = event.target.value
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
  background: #f1f5f9;
}

.demo-element {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  margin-top: 1rem;
}

.div-style {
  background: #f0f9ff;
  color: #0369a1;
}

.span-style {
  background: #fef3c7;
  color: #92400e;
  display: inline-block;
}

.button-style {
  background: #dcfce7;
  color: #166534;
  cursor: pointer;
}

.button-style:hover {
  background: #bbf7d0;
}

.input-style {
  background: #f8fafc;
  color: #334155;
  border: 2px solid #cbd5e1;
}
</style>
```

### 2. Vue 组件切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToCard">卡片组件</button>
      <button @click="switchToList">列表组件</button>
      <button @click="switchToForm">表单组件</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent" 
      v-bind="componentProps"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

// 卡片组件
const CardComponent = {
  name: 'CardComponent',
  props: ['title', 'content', 'image'],
  template: `
    <div class="card">
      <img v-if="image" :src="image" :alt="title" class="card-image">
      <div class="card-content">
        <h3>{{ title }}</h3>
        <p>{{ content }}</p>
      </div>
    </div>
  `
}

// 列表组件
const ListComponent = {
  name: 'ListComponent',
  props: ['items'],
  template: `
    <ul class="list">
      <li v-for="item in items" :key="item.id" class="list-item">
        {{ item.name }}
      </li>
    </ul>
  `
}

// 表单组件
const FormComponent = {
  name: 'FormComponent',
  props: ['fields'],
  emits: ['update'],
  data() {
    return {
      formData: {}
    }
  },
  template: `
    <form @submit.prevent="handleSubmit" class="form">
      <div v-for="field in fields" :key="field.name" class="form-field">
        <label :for="field.name">{{ field.label }}</label>
        <input 
          :id="field.name"
          v-model="formData[field.name]"
          :type="field.type"
          :placeholder="field.placeholder"
        >
      </div>
      <button type="submit">提交</button>
    </form>
  `,
  methods: {
    handleSubmit() {
      this.$emit('update', this.formData)
    }
  }
}

const currentComponent = ref(CardComponent)

const componentProps = reactive({
  // 卡片组件 props
  title: '示例卡片',
  content: '这是一个动态切换的卡片组件',
  image: 'https://via.placeholder.com/300x200',
  
  // 列表组件 props
  items: [
    { id: 1, name: '项目 1' },
    { id: 2, name: '项目 2' },
    { id: 3, name: '项目 3' }
  ],
  
  // 表单组件 props
  fields: [
    { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
    { name: 'email', label: '邮箱', type: 'email', placeholder: '请输入邮箱' },
    { name: 'age', label: '年龄', type: 'number', placeholder: '请输入年龄' }
  ]
})

const switchToCard = () => {
  currentComponent.value = CardComponent
}

const switchToList = () => {
  currentComponent.value = ListComponent
}

const switchToForm = () => {
  currentComponent.value = FormComponent
}

const handleUpdate = (data) => {
  console.log('表单数据更新:', data)
  alert('表单提交成功！')
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
  background: #f1f5f9;
}

/* 卡片组件样式 */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  max-width: 300px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.card-content p {
  margin: 0;
  color: #64748b;
}

/* 列表组件样式 */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: #f8fafc;
}

/* 表单组件样式 */
.form {
  max-width: 400px;
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.25rem;
  color: #374151;
  font-weight: 500;
}

.form-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form-field input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
}

.form button:hover {
  background: #2563eb;
}
</style>
```

## 高级动态切换

### 3. 异步组件切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">用户资料</button>
      <button @click="loadComponent('Settings')">设置</button>
      <button @click="loadComponent('Dashboard')">仪表板</button>
      <button @click="loadComponent('Analytics')">分析</button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    
    <EwVueComponent 
      v-else-if="currentComponent"
      :is="currentComponent" 
      v-bind="componentProps"
      @error="handleError"
    />
    
    <div v-else class="placeholder">
      <p>请选择一个组件</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const loading = ref(false)

// 组件映射表
const componentMap = {
  UserProfile: () => import('./components/UserProfile.vue'),
  Settings: () => import('./components/Settings.vue'),
  Dashboard: () => import('./components/Dashboard.vue'),
  Analytics: () => import('./components/Analytics.vue')
}

// 组件属性映射
const propsMap = {
  UserProfile: {
    userId: 123,
    showAvatar: true,
    showDetails: true
  },
  Settings: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: true
  },
  Dashboard: {
    widgets: ['chart', 'stats', 'recent'],
    layout: 'grid'
  },
  Analytics: {
    dateRange: 'last30days',
    metrics: ['visits', 'conversions', 'revenue']
  }
}

const componentProps = reactive({})

const loadComponent = async (name) => {
  loading.value = true
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 加载组件
    currentComponent.value = componentMap[name]
    
    // 设置组件属性
    Object.assign(componentProps, propsMap[name])
    
    console.log(`组件 ${name} 加载成功`)
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const handleError = (error) => {
  console.error('组件加载失败:', error)
  loading.value = false
  currentComponent.value = null
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
  flex-wrap: wrap;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 0.5rem;
}
</style>
```

### 4. 条件渲染切换

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        <input v-model="showComponent" type="checkbox" />
        显示组件
      </label>
      <select v-model="componentType">
        <option value="card">卡片</option>
        <option value="list">列表</option>
        <option value="form">表单</option>
        <option value="chart">图表</option>
      </select>
    </div>
    
    <EwVueComponent 
      v-if="showComponent"
      :is="currentComponent"
      v-bind="componentProps"
      @update="handleUpdate"
    />
    
    <div v-else class="hidden">
      <p>组件已隐藏</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const showComponent = ref(true)
const componentType = ref('card')

// 组件映射
const componentMap = {
  card: {
    name: 'CardComponent',
    template: `
      <div class="card">
        <h3>{{ title }}</h3>
        <p>{{ content }}</p>
        <button @click="$emit('update', { action: 'click', data: { title, content } })">
          点击我
        </button>
      </div>
    `,
    props: ['title', 'content']
  },
  list: {
    name: 'ListComponent',
    template: `
      <ul class="list">
        <li v-for="item in items" :key="item.id" class="list-item">
          {{ item.name }}
        </li>
      </ul>
    `,
    props: ['items']
  },
  form: {
    name: 'FormComponent',
    template: `
      <form @submit.prevent="handleSubmit" class="form">
        <input v-model="formData.name" placeholder="姓名" required>
        <input v-model="formData.email" type="email" placeholder="邮箱" required>
        <button type="submit">提交</button>
      </form>
    `,
    props: ['initialData'],
    data() {
      return {
        formData: this.initialData || { name: '', email: '' }
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('update', { action: 'submit', data: this.formData })
      }
    }
  },
  chart: {
    name: 'ChartComponent',
    template: `
      <div class="chart">
        <h3>{{ title }}</h3>
        <div class="chart-container">
          <div v-for="(value, label) in data" :key="label" class="chart-bar">
            <div class="bar" :style="{ height: value + '%' }"></div>
            <span class="label">{{ label }}</span>
          </div>
        </div>
      </div>
    `,
    props: ['title', 'data']
  }
}

const currentComponent = computed(() => componentMap[componentType.value])

const componentProps = computed(() => {
  const props = {
    card: {
      title: '动态卡片',
      content: '这是一个根据类型动态切换的卡片组件'
    },
    list: {
      items: [
        { id: 1, name: '项目 A' },
        { id: 2, name: '项目 B' },
        { id: 3, name: '项目 C' }
      ]
    },
    form: {
      initialData: { name: '', email: '' }
    },
    chart: {
      title: '数据图表',
      data: {
        '一月': 65,
        '二月': 78,
        '三月': 90,
        '四月': 85,
        '五月': 92
      }
    }
  }
  
  return props[componentType.value] || {}
})

const handleUpdate = (data) => {
  console.log('组件更新:', data)
  
  if (data.action === 'submit') {
    alert(`表单提交成功！\n姓名: ${data.data.name}\n邮箱: ${data.data.email}`)
  } else if (data.action === 'click') {
    alert(`卡片被点击！\n标题: ${data.data.title}`)
  }
}

// 监听组件类型变化
watch(componentType, (newType) => {
  console.log('组件类型切换为:', newType)
})
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
  gap: 1rem;
  align-items: center;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.controls select {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
}

.hidden {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 0.5rem;
}

/* 卡片组件样式 */
.card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}

.card h3 {
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.card p {
  margin: 0 0 1rem 0;
  color: #64748b;
}

.card button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.card button:hover {
  background: #2563eb;
}

/* 列表组件样式 */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background: #f8fafc;
}

/* 表单组件样式 */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form button {
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
}

.form button:hover {
  background: #059669;
}

/* 图表组件样式 */
.chart {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
}

.chart h3 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  text-align: center;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 200px;
  padding: 1rem 0;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 0.25rem 0.25rem 0 0;
  min-height: 20px;
  transition: height 0.3s ease;
}

.label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}
</style>
```

## 注意事项

1. **性能优化**: 频繁切换组件时，考虑使用 `keep-alive` 保持组件状态
2. **错误处理**: 始终监听 `error` 事件，提供合适的降级方案
3. **类型安全**: 使用 TypeScript 时，为组件和属性定义正确的类型
4. **用户体验**: 异步组件加载时提供加载状态和错误提示
5. **内存管理**: 及时清理不需要的组件引用，避免内存泄漏

## 下一步

- 查看 [错误处理示例](/zh-CN/examples/error-handling) 了解错误处理最佳实践
- 浏览 [API 文档](/zh-CN/api/) 了解完整的 API 参考
- 参考 [最佳实践](/zh-CN/guide/best-practices) 学习更多使用技巧 