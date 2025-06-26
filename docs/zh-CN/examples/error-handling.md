# 错误处理示例

## 基础错误处理

### 1. 监听错误事件

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadValidComponent">加载有效组件</button>
      <button @click="loadInvalidComponent">加载无效组件</button>
      <button @click="loadAsyncErrorComponent">加载异步错误组件</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      @error="handleError"
    />
    
    <div v-if="errorInfo" class="error-info">
      <h4>错误信息:</h4>
      <p><strong>消息:</strong> {{ errorInfo.message }}</p>
      <p><strong>类型:</strong> {{ errorInfo.type }}</p>
      <p><strong>时间:</strong> {{ errorInfo.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const errorInfo = ref(null)

const loadValidComponent = () => {
  currentComponent.value = 'div'
  errorInfo.value = null
}

const loadInvalidComponent = () => {
  currentComponent.value = 'NonExistentComponent'
  errorInfo.value = null
}

const loadAsyncErrorComponent = () => {
  currentComponent.value = () => Promise.reject(new Error('异步组件加载失败'))
  errorInfo.value = null
}

const handleError = (error) => {
  console.error('组件错误:', error)
  
  errorInfo.value = {
    message: error.message,
    type: error.name || 'UnknownError',
    timestamp: new Date().toLocaleString()
  }
  
  // 可以在这里发送错误日志到服务器
  // sendErrorToServer(error)
}
</script>

<style scoped>
.error-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-info h4 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
}

.error-info p {
  margin: 0.25rem 0;
}
</style>
```

### 2. 使用 fallback 组件

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">用户资料</button>
      <button @click="loadComponent('Settings')">设置</button>
      <button @click="loadComponent('BrokenComponent')">损坏组件</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :fallback="fallbackComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// 自定义 fallback 组件
const fallbackComponent = {
  name: 'FallbackComponent',
  render() {
    return h('div', { class: 'fallback-component' }, [
      h('h3', '备用组件'),
      h('p', '原始组件加载失败，显示备用内容'),
      h('button', {
        onClick: () => this.$emit('retry')
      }, '重试加载')
    ])
  }
}

const componentMap = {
  UserProfile: {
    name: 'UserProfile',
    template: `
      <div class="user-profile">
        <h3>用户资料</h3>
        <p>用户名: 张三</p>
        <p>邮箱: zhangsan@example.com</p>
      </div>
    `
  },
  Settings: {
    name: 'Settings',
    template: `
      <div class="settings">
        <h3>设置</h3>
        <p>主题: 深色</p>
        <p>语言: 中文</p>
      </div>
    `
  }
}

const loadComponent = (name) => {
  currentComponent.value = componentMap[name] || 'BrokenComponent'
}

const handleError = (error) => {
  console.error('组件错误，使用 fallback:', error)
}
</script>

<style scoped>
.fallback-component {
  padding: 2rem;
  text-align: center;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  color: #92400e;
}

.fallback-component button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.user-profile, .settings {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.user-profile {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.settings {
  background: #dcfce7;
  border-color: #22c55e;
}
</style>
```

## 高级错误处理

### 1. 自定义错误组件

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('NormalComponent')">正常组件</button>
      <button @click="loadComponent('ErrorComponent')">错误组件</button>
      <button @click="loadComponent('NetworkErrorComponent')">网络错误组件</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :error-component="errorComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// 动态错误组件
const errorComponent = {
  name: 'DynamicErrorComponent',
  props: ['error'],
  render() {
    const error = this.error || {}
    
    return h('div', { class: 'error-component' }, [
      h('div', { class: 'error-icon' }, '⚠️'),
      h('h3', '组件加载失败'),
      h('p', { class: 'error-message' }, error.message || '未知错误'),
      h('div', { class: 'error-actions' }, [
        h('button', {
          onClick: () => this.$emit('retry')
        }, '重试'),
        h('button', {
          onClick: () => this.$emit('fallback')
        }, '使用备用组件'),
        h('button', {
          onClick: () => this.$emit('report')
        }, '报告问题')
      ])
    ])
  }
}

const componentMap = {
  NormalComponent: {
    name: 'NormalComponent',
    template: `
      <div class="normal-component">
        <h3>正常组件</h3>
        <p>这个组件工作正常</p>
      </div>
    `
  },
  ErrorComponent: 'NonExistentComponent',
  NetworkErrorComponent: () => Promise.reject(new Error('网络连接失败'))
}

const loadComponent = (name) => {
  currentComponent.value = componentMap[name]
}

const handleError = (error) => {
  console.error('组件错误:', error)
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

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  margin: 1rem 0;
  font-weight: 600;
}

.error-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.error-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.error-actions button:first-child {
  background: #dc2626;
  color: white;
}

.error-actions button:nth-child(2) {
  background: #f59e0b;
  color: white;
}

.error-actions button:last-child {
  background: #6b7280;
  color: white;
}

.error-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.normal-component {
  padding: 1rem;
  background: #dcfce7;
  border: 1px solid #22c55e;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
```

### 2. 错误恢复机制

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('StableComponent')">稳定组件</button>
      <button @click="loadComponent('UnstableComponent')">不稳定组件</button>
      <button @click="loadComponent('BrokenComponent')">损坏组件</button>
    </div>
    
    <div v-if="showRetry" class="retry-container">
      <p>组件加载失败，是否重试？</p>
      <div class="retry-actions">
        <button @click="retryLoad">重试 ({{ retryCount }}/{{ maxRetries }})</button>
        <button @click="useFallback">使用备用组件</button>
        <button @click="cancelRetry">取消</button>
      </div>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :fallback="fallbackComponent"
      :error-component="errorComponent"
      @error="handleError"
    />
    
    <div v-if="errorHistory.length > 0" class="error-history">
      <h4>错误历史:</h4>
      <ul>
        <li v-for="(error, index) in errorHistory" :key="index">
          {{ error.message }} - {{ error.timestamp }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const showRetry = ref(false)
const retryCount = ref(0)
const maxRetries = 3
const errorHistory = ref([])
const lastFailedComponent = ref(null)

// 备用组件
const fallbackComponent = {
  name: 'FallbackComponent',
  render() {
    return h('div', { class: 'fallback-component' }, [
      h('h3', '备用组件'),
      h('p', '由于多次加载失败，显示备用内容'),
      h('p', '请检查网络连接或联系管理员')
    ])
  }
}

// 错误组件
const errorComponent = {
  name: 'ErrorComponent',
  props: ['error'],
  render() {
    return h('div', { class: 'error-component' }, [
      h('h3', '组件错误'),
      h('p', this.error?.message || '未知错误'),
      h('button', {
        onClick: () => this.$emit('retry')
      }, '重试')
    ])
  }
}

const componentMap = {
  StableComponent: {
    name: 'StableComponent',
    template: `
      <div class="stable-component">
        <h3>稳定组件</h3>
        <p>这个组件总是能正常工作</p>
      </div>
    `
  },
  UnstableComponent: () => {
    // 模拟不稳定的组件，50% 概率失败
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({
            name: 'UnstableComponent',
            template: `
              <div class="unstable-component">
                <h3>不稳定组件</h3>
                <p>这次加载成功了</p>
              </div>
            `
          })
        } else {
          reject(new Error('组件加载失败'))
        }
      }, 1000)
    })
  },
  BrokenComponent: () => Promise.reject(new Error('组件已损坏'))
}

const loadComponent = (name) => {
  currentComponent.value = componentMap[name]
  showRetry.value = false
  retryCount.value = 0
}

const handleError = (error) => {
  console.error('组件错误:', error)
  
  // 记录错误历史
  errorHistory.value.push({
    message: error.message,
    timestamp: new Date().toLocaleString(),
    component: currentComponent.value
  })
  
  // 限制错误历史数量
  if (errorHistory.value.length > 10) {
    errorHistory.value.shift()
  }
  
  lastFailedComponent.value = currentComponent.value
  
  if (retryCount.value < maxRetries) {
    showRetry.value = true
  } else {
    // 超过最大重试次数，使用备用组件
    currentComponent.value = fallbackComponent
  }
}

const retryLoad = () => {
  retryCount.value++
  showRetry.value = false
  
  // 重新加载组件
  currentComponent.value = lastFailedComponent.value
}

const useFallback = () => {
  showRetry.value = false
  currentComponent.value = fallbackComponent
}

const cancelRetry = () => {
  showRetry.value = false
  currentComponent.value = 'div'
}
</script>

<style scoped>
.retry-container {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  margin: 1rem 0;
  text-align: center;
}

.retry-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.retry-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-actions button:first-child {
  background: #f59e0b;
  color: white;
}

.retry-actions button:nth-child(2) {
  background: #22c55e;
  color: white;
}

.retry-actions button:last-child {
  background: #6b7280;
  color: white;
}

.error-history {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.error-history h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.error-history ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-history li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #6b7280;
}

.error-history li:last-child {
  border-bottom: none;
}

.fallback-component {
  padding: 2rem;
  text-align: center;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  color: #92400e;
}

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

.stable-component, .unstable-component {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.stable-component {
  background: #dcfce7;
  border-color: #22c55e;
}

.unstable-component {
  background: #fef3c7;
  border-color: #f59e0b;
}
</style>
```

### 3. 错误边界和降级策略

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('SimpleComponent')">简单组件</button>
      <button @click="loadComponent('ComplexComponent')">复杂组件</button>
      <button @click="loadComponent('HeavyComponent')">重型组件</button>
    </div>
    
    <div class="component-container">
      <EwVueComponent 
        :is="currentComponent"
        :fallback="fallbackComponent"
        :error-component="errorComponent"
        @error="handleError"
      />
    </div>
    
    <div v-if="errorStats" class="error-stats">
      <h4>错误统计:</h4>
      <p>总错误数: {{ errorStats.total }}</p>
      <p>成功率: {{ errorStats.successRate }}%</p>
      <p>平均恢复时间: {{ errorStats.avgRecoveryTime }}ms</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const errorCount = ref(0)
const successCount = ref(0)
const recoveryTimes = ref([])
const startTime = ref(null)

// 错误统计
const errorStats = computed(() => {
  const total = errorCount.value + successCount.value
  const successRate = total > 0 ? Math.round((successCount.value / total) * 100) : 100
  const avgRecoveryTime = recoveryTimes.value.length > 0 
    ? Math.round(recoveryTimes.value.reduce((a, b) => a + b, 0) / recoveryTimes.value.length)
    : 0
  
  return {
    total: errorCount.value,
    successRate,
    avgRecoveryTime
  }
})

// 备用组件
const fallbackComponent = {
  name: 'FallbackComponent',
  render() {
    return h('div', { class: 'fallback-component' }, [
      h('h3', '备用组件'),
      h('p', '由于组件加载失败，显示简化版本'),
      h('div', { class: 'fallback-content' }, [
        h('p', '基础功能仍然可用'),
        h('p', '如需完整功能，请刷新页面')
      ])
    ])
  }
}

// 错误组件
const errorComponent = {
  name: 'ErrorComponent',
  props: ['error'],
  render() {
    const error = this.error || {}
    const errorType = this.getErrorType(error)
    
    return h('div', { class: 'error-component' }, [
      h('div', { class: 'error-header' }, [
        h('span', { class: 'error-icon' }, this.getErrorIcon(errorType)),
        h('h3', this.getErrorTitle(errorType))
      ]),
      h('p', { class: 'error-message' }, error.message || '未知错误'),
      h('div', { class: 'error-suggestions' }, [
        h('p', '建议操作:'),
        h('ul', this.getErrorSuggestions(errorType))
      ])
    ])
  },
  methods: {
    getErrorType(error) {
      if (error.message?.includes('网络')) return 'network'
      if (error.message?.includes('组件')) return 'component'
      if (error.message?.includes('权限')) return 'permission'
      return 'unknown'
    },
    getErrorIcon(type) {
      const icons = {
        network: '🌐',
        component: '🔧',
        permission: '🔒',
        unknown: '❌'
      }
      return icons[type] || icons.unknown
    },
    getErrorTitle(type) {
      const titles = {
        network: '网络连接错误',
        component: '组件加载错误',
        permission: '权限不足',
        unknown: '未知错误'
      }
      return titles[type] || titles.unknown
    },
    getErrorSuggestions(type) {
      const suggestions = {
        network: [
          '检查网络连接',
          '稍后重试',
          '联系网络管理员'
        ],
        component: [
          '刷新页面',
          '清除浏览器缓存',
          '联系技术支持'
        ],
        permission: [
          '检查用户权限',
          '联系管理员',
          '使用其他账号'
        ],
        unknown: [
          '刷新页面',
          '联系技术支持'
        ]
      }
      return (suggestions[type] || suggestions.unknown).map(suggestion => 
        h('li', suggestion)
      )
    }
  }
}

const componentMap = {
  SimpleComponent: {
    name: 'SimpleComponent',
    template: `
      <div class="simple-component">
        <h3>简单组件</h3>
        <p>这是一个简单的组件，很少出错</p>
      </div>
    `
  },
  ComplexComponent: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({
            name: 'ComplexComponent',
            template: `
              <div class="complex-component">
                <h3>复杂组件</h3>
                <p>这是一个复杂的组件，偶尔会出错</p>
                <div class="complex-content">
                  <p>包含多个子组件和复杂逻辑</p>
                </div>
              </div>
            `
          })
        } else {
          reject(new Error('复杂组件加载失败'))
        }
      }, 1500)
    })
  },
  HeavyComponent: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.7) {
          resolve({
            name: 'HeavyComponent',
            template: `
              <div class="heavy-component">
                <h3>重型组件</h3>
                <p>这是一个重型组件，经常出错</p>
                <div class="heavy-content">
                  <p>包含大量数据和复杂渲染</p>
                </div>
              </div>
            `
          })
        } else {
          reject(new Error('重型组件加载失败'))
        }
      }, 2000)
    })
  }
}

const loadComponent = (name) => {
  startTime.value = Date.now()
  currentComponent.value = componentMap[name]
}

const handleError = (error) => {
  console.error('组件错误:', error)
  
  errorCount.value++
  
  // 记录恢复时间
  if (startTime.value) {
    const recoveryTime = Date.now() - startTime.value
    recoveryTimes.value.push(recoveryTime)
    
    // 限制记录数量
    if (recoveryTimes.value.length > 20) {
      recoveryTimes.value.shift()
    }
  }
  
  // 根据错误类型选择不同的降级策略
  if (error.message?.includes('网络')) {
    // 网络错误，使用离线模式
    currentComponent.value = {
      name: 'OfflineComponent',
      template: `
        <div class="offline-component">
          <h3>离线模式</h3>
          <p>网络连接失败，使用离线功能</p>
        </div>
      `
    }
  } else if (error.message?.includes('重型')) {
    // 重型组件错误，使用简化版本
    currentComponent.value = {
      name: 'SimpleVersionComponent',
      template: `
        <div class="simple-version-component">
          <h3>简化版本</h3>
          <p>重型组件加载失败，显示简化版本</p>
        </div>
      `
    }
  }
}

// 成功加载时记录
const handleSuccess = () => {
  successCount.value++
}
</script>

<style scoped>
.component-container {
  margin: 1rem 0;
  min-height: 200px;
}

.error-stats {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.error-stats h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.error-stats p {
  margin: 0.25rem 0;
  color: #6b7280;
}

.fallback-component {
  padding: 2rem;
  text-align: center;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  color: #92400e;
}

.fallback-content {
  margin-top: 1rem;
  text-align: left;
}

.error-component {
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2rem;
}

.error-message {
  font-weight: 600;
  margin-bottom: 1rem;
}

.error-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-suggestions li {
  padding: 0.25rem 0;
  color: #6b7280;
}

.simple-component, .complex-component, .heavy-component,
.offline-component, .simple-version-component {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.simple-component {
  background: #dcfce7;
  border-color: #22c55e;
}

.complex-component {
  background: #fef3c7;
  border-color: #f59e0b;
}

.heavy-component {
  background: #f3e8ff;
  border-color: #8b5cf6;
}

.offline-component {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.simple-version-component {
  background: #fef2f2;
  border-color: #fecaca;
}
</style>
```

## 注意事项

1. **错误分类**: 根据错误类型提供不同的处理策略
2. **用户体验**: 提供清晰的错误信息和恢复选项
3. **性能监控**: 记录错误统计和恢复时间
4. **降级策略**: 提供多层次的降级方案
5. **错误上报**: 将错误信息发送到服务器进行分析

## 下一步

- 查看 [动态切换示例](/zh-CN/examples/dynamic) 了解更多组件切换技巧
- 浏览 [基础示例](/zh-CN/examples/basic) 学习基础用法
- 参考 [最佳实践](/zh-CN/guide/best-practices) 学习错误处理最佳实践 