<template>
  <div class="demo">
    <h2>🛡️ 错误处理与重试机制演示</h2>
    <p>展示 EwVueComponent 的错误边界和自动重试功能</p>
    
    <div class="demo-section">
      <h3>1. 组件加载失败演示</h3>
      <p class="demo-desc">组件初始加载失败，3秒后自动修复并重新渲染</p>
      <div class="demo-item">
        <EwVueComponent 
          :is="errorComponent" 
          @error="handleError"
        >
          <div class="ew-vue-component-fallback">
            ⚠️ 回退到默认插槽内容
          </div>
        </EwVueComponent>
      </div>
    </div>

    <div class="demo-section">
      <h3>2. 异步组件加载失败</h3>
      <p class="demo-desc">异步组件前3次加载失败，第4次成功（自动重试机制）</p>
      <div class="demo-item">
        <EwVueComponent 
          :is="failingAsyncComponent" 
          @error="handleAsyncError"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>3. 手动触发重试</h3>
      <div class="demo-item">
        <button @click="triggerManualRetry" class="ew-vue-component-retry-btn">
          手动重试加载组件
        </button>
        <div v-if="manualRetryResult" class="result">
          {{ manualRetryResult }}
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>4. 错误日志</h3>
      <div class="error-log">
        <div v-for="(log, index) in errorLogs" :key="index" class="log-entry">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
        <div v-if="errorLogs.length === 0" class="no-logs">
          暂无错误日志
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const errorLogs = ref([])
const manualRetryResult = ref('')

// 可控制失败的组件
const shouldFail = ref(true)
const errorComponent = {
  name: 'ErrorComponent',
  setup() {
    if (shouldFail.value) {
      throw new Error('这是一个故意抛出的错误，用于演示错误处理机制')
    }
    return () => h('div', { class: 'success-component' }, [
      h('h3', '✅ 组件加载成功！'),
      h('p', '错误已修复，组件正常渲染'),
      h('button', { 
        onClick: () => shouldFail.value = true,
        class: 'reset-btn'
      }, '重置为错误状态')
    ])
  }
}

// 可控制失败的异步组件
const asyncShouldFail = ref(true)
const asyncRetryCount = ref(0)

const failingAsyncComponent = defineAsyncComponent({
  loader: async () => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 前3次失败，第4次成功
    if (asyncShouldFail.value && asyncRetryCount.value < 3) {
      asyncRetryCount.value++
      throw new Error(`异步组件加载失败 - 网络错误 (第${asyncRetryCount.value}次尝试)`)
    }
    
    // 成功加载
    asyncShouldFail.value = false
    return {
      name: 'AsyncSuccessComponent',
      setup() {
        return () => h('div', { class: 'async-success-component' }, [
          h('h3', '🎉 异步组件加载成功！'),
          h('p', `经过 ${asyncRetryCount.value} 次重试后成功加载`),
          h('button', { 
            onClick: () => {
              asyncShouldFail.value = true
              asyncRetryCount.value = 0
            },
            class: 'reset-btn'
          }, '重置为失败状态')
        ])
      }
    }
  },
  loadingComponent: {
    template: '<div class="ew-vue-component-loading">正在加载异步组件...</div>'
  },
  errorComponent: {
    template: `
      <div class="ew-vue-component-error">
        <div>异步组件加载失败</div>
        <button class="ew-vue-component-retry-btn" onclick="window.location.reload()">
          重试加载
        </button>
      </div>
    `
  },
  delay: 200,
  timeout: 5000
})

const addErrorLog = (message) => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  errorLogs.value.unshift({ time, message })
  
  // 限制日志数量
  if (errorLogs.value.length > 10) {
    errorLogs.value = errorLogs.value.slice(0, 10)
  }
}

const handleError = (error) => {
  console.error('组件错误:', error)
  addErrorLog(`组件错误: ${error.message}`)
  
  // 3秒后自动修复错误（模拟错误修复）
  setTimeout(() => {
    shouldFail.value = false
    addErrorLog('错误已自动修复，组件重新加载')
  }, 3000)
}

const handleAsyncError = (error) => {
  console.error('异步组件错误:', error)
  addErrorLog(`异步组件错误: ${error.message}`)
}

const triggerManualRetry = () => {
  manualRetryResult.value = '正在重试...'
  
  // 模拟重试操作
  setTimeout(() => {
    const success = Math.random() > 0.5
    if (success) {
      manualRetryResult.value = '✅ 重试成功！'
      addErrorLog('手动重试成功')
    } else {
      manualRetryResult.value = '❌ 重试失败，请稍后再试'
      addErrorLog('手动重试失败')
    }
    
    // 清除结果
    setTimeout(() => {
      manualRetryResult.value = ''
    }, 3000)
  }, 1500)
}
</script>

<style>
/* 导入组件样式 */
@import url('https://unpkg.com/ew-vue-component@0.0.2-beta.5/dist/ew-vue-component.css');
</style>

<style scoped>
.demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.demo h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.demo > p {
  color: #718096;
  margin-bottom: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8f9fa;
}

.demo-section h3 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.demo-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.demo-item {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.result {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.error-log {
  background: #1a202c;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.log-entry {
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #2d3748;
}

.log-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.log-time {
  color: #9ca3af;
  margin-right: 1rem;
  min-width: 80px;
  font-size: 0.8rem;
}

.log-message {
  color: #fecaca;
  flex: 1;
}

.no-logs {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

/* 成功状态组件样式 */
:global(.success-component),
:global(.async-success-component) {
  padding: 2rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 2px solid #16a34a;
  border-radius: 8px;
  text-align: center;
  color: #15803d;
}

:global(.success-component h3),
:global(.async-success-component h3) {
  margin: 0 0 1rem 0;
  font-size: 1.5em;
  color: #15803d;
}

:global(.success-component p),
:global(.async-success-component p) {
  margin: 0 0 1.5rem 0;
  color: #166534;
}

:global(.reset-btn) {
  background: #f97316;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

:global(.reset-btn:hover) {
  background: #ea580c;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .demo {
    padding: 1rem;
  }
  
  .demo-section {
    padding: 1rem;
  }
}
</style> 