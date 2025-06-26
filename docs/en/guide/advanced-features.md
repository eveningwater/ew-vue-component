# Advanced Features

This section introduces advanced features of EwVueComponent, such as async components, error boundaries, plugin extensions, and performance optimization.

## Async Component Loading

EwVueComponent supports async components for code splitting and on-demand loading:

### 1. Basic Async Components

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">User Profile</button>
      <button @click="loadComponent('Settings')">Settings</button>
      <button @click="loadComponent('Dashboard')">Dashboard</button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentComponent.value = componentMap[name]
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const handleError = (error) => {
  console.error('Async component loading failed:', error)
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

### 2. Async Components with Loading Progress

```vue
<template>
  <div class="demo">
    <button @click="loadHeavyComponent">Load Heavy Component</button>
    
    <div v-if="loading" class="loading-state">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      <p>Loading progress: {{ progress }}%</p>
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
  
  // Simulate loading progress
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
  console.error('Component loading failed:', error)
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

## Error Boundaries and Fallback Handling

EwVueComponent provides comprehensive error handling mechanisms:

### 1. Basic Error Handling

```vue
<template>
  <div class="demo">
    <button @click="loadErrorComponent">Load Error Component</button>
    
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
  // Intentionally load a non-existent component
  currentComponent.value = 'NonExistentComponent'
}

const handleError = (error) => {
  console.error('Component error:', error)
  // Fallback to default component
  currentComponent.value = 'div'
}
</script>
```

### 2. Using Fallback Components

```vue
<template>
  <div class="demo">
    <button @click="loadUnstableComponent">Load Unstable Component</button>
    
    <EwVueComponent 
      :is="currentComponent"
      fallback="div"
      @error="handleError"
    >
      <template #default>
        <p>Main content</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const loadUnstableComponent = () => {
  // Simulate unstable component
  currentComponent.value = Math.random() > 0.5 ? 'UnstableComponent' : 'div'
}

const handleError = (error) => {
  console.error('Component error, using fallback:', error)
}
</script>
```

### 3. Custom Error Components

```vue
<template>
  <div class="demo">
    <button @click="loadBrokenComponent">Load Broken Component</button>
    
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

const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    return h('div', { class: 'error-component' }, [
      h('h3', 'Component Loading Failed'),
      h('p', `Error: ${this.error?.message || 'Unknown error'}`),
      h('button', {
        onClick: () => this.retry?.()
      }, 'Retry')
    ])
  }
}

const loadBrokenComponent = () => {
  currentComponent.value = 'BrokenComponent'
}

const handleError = (error) => {
  console.error('Component error, showing custom error component:', error)
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
</style>
```

## Caching and Performance Optimization

### 1. Component Caching

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('Heavy')">Load Heavy Component</button>
      <button @click="loadComponent('Complex')">Load Complex Component</button>
      <button @click="clearCache">Clear Cache</button>
    </div>
    
    <p>Cache status: {{ cacheStatus }}</p>
    
    <EwVueComponent 
      :is="currentComponent"
      :cache="true"
      :cache-key="cacheKey"
      :cache-ttl="300000"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const componentType = ref('Heavy')

const componentMap = {
  Heavy: () => import('./components/HeavyComponent.vue'),
  Complex: () => import('./components/ComplexComponent.vue')
}

const cacheKey = computed(() => `component-${componentType.value}`)
const cacheStatus = ref('No cache')

const loadComponent = (type) => {
  componentType.value = type
  currentComponent.value = componentMap[type]
  cacheStatus.value = `Loaded ${type} component`
}

const clearCache = () => {
  // This would trigger cache clearing in the component
  cacheStatus.value = 'Cache cleared'
}

const handleError = (error) => {
  console.error('Component error:', error)
}
</script>
```

### 2. Performance Monitoring

```vue
<template>
  <div class="demo">
    <button @click="loadComponentWithMonitoring">Load with Monitoring</button>
    
    <div v-if="performanceData" class="performance-info">
      <h4>Performance Data:</h4>
      <p>Render time: {{ performanceData.renderTime }}ms</p>
      <p>Load time: {{ performanceData.loadTime }}ms</p>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :plugins="[performancePlugin]"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const performanceData = ref(null)

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    context.data.startTime = performance.now()
  },
  afterRender(component, props, context) {
    const endTime = performance.now()
    const renderTime = endTime - context.data.startTime
    
    performanceData.value = {
      renderTime: renderTime.toFixed(2),
      loadTime: (endTime - context.data.loadStartTime || 0).toFixed(2)
    }
  }
}

const loadComponentWithMonitoring = async () => {
  const loadStartTime = performance.now()
  
  try {
    currentComponent.value = () => import('./components/TestComponent.vue')
  } catch (error) {
    handleError(error)
  }
}

const handleError = (error) => {
  console.error('Component error:', error)
}
</script>

<style scoped>
.performance-info {
  margin: 1rem 0;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 0.5rem;
}
</style>
```

## Plugin System

### 1. Creating Custom Plugins

```javascript
// Custom logging plugin
const customLogPlugin = {
  name: 'custom-log',
  
  beforeRender(component, props, context) {
    console.log(`🚀 Rendering component: ${component.name || component}`)
    context.data.renderStartTime = performance.now()
  },
  
  afterRender(component, props, context) {
    const duration = performance.now() - context.data.renderStartTime
    console.log(`✅ Component rendered in ${duration.toFixed(2)}ms`)
  },
  
  onError(error, context) {
    console.error(`❌ Component error: ${error.message}`)
    // Send error to monitoring service
    this.reportError(error, context)
  },
  
  reportError(error, context) {
    // Implement error reporting logic
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        component: context.component,
        timestamp: new Date().toISOString()
      })
    })
  }
}
```

### 2. Using Multiple Plugins

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="plugins"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const plugins = [
  {
    name: 'logger',
    beforeRender(component, props, context) {
      context.utils.log('Starting render:', component)
    }
  },
  {
    name: 'analytics',
    afterRender(component, props, context) {
      // Track component usage
      analytics.track('component_rendered', {
        component: component.name || component,
        timestamp: Date.now()
      })
    }
  },
  {
    name: 'error-reporter',
    onError(error, context) {
      // Report errors to external service
      errorService.report(error, context)
    }
  }
]

const handleError = (error) => {
  console.error('Component error:', error)
}
</script>
```

## Best Practices

### 1. Component Organization

```javascript
// utils/componentLoader.js
export const createComponentLoader = (components) => {
  const cache = new Map()
  
  return {
    load: async (name) => {
      if (cache.has(name)) {
        return cache.get(name)
      }
      
      const component = await components[name]()
      cache.set(name, component)
      return component
    },
    
    preload: async (names) => {
      const promises = names.map(name => this.load(name))
      await Promise.all(promises)
    },
    
    clear: () => {
      cache.clear()
    }
  }
}

// Usage
const loader = createComponentLoader({
  UserProfile: () => import('@/components/UserProfile.vue'),
  Settings: () => import('@/components/Settings.vue'),
  Dashboard: () => import('@/components/Dashboard.vue')
})
```

### 2. Error Boundary Pattern

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="FallbackComponent"
    :error-component="ErrorComponent"
    @error="handleGlobalError"
  >
    <template #default>
      <AppLoader v-if="loading" />
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import AppLoader from '@/components/AppLoader.vue'

const currentComponent = ref(null)
const loading = ref(false)

const FallbackComponent = {
  render() {
    return h('div', { class: 'fallback' }, [
      h('h3', 'Something went wrong'),
      h('p', 'Please try refreshing the page')
    ])
  }
}

const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    return h('div', { class: 'error-boundary' }, [
      h('h3', 'Component Error'),
      h('p', this.error?.message),
      h('button', { onClick: this.retry }, 'Retry')
    ])
  }
}

const handleGlobalError = (error) => {
  // Global error handling
  console.error('Global component error:', error)
  
  // Report to error monitoring service
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error)
  }
}
</script>
```

### 3. Performance Optimization

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :cache="shouldCache"
    :cache-key="cacheKey"
    :cache-ttl="cacheTtl"
    :plugins="performancePlugins"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const componentSize = ref('medium') // small, medium, large

// Dynamic caching based on component size
const shouldCache = computed(() => componentSize.value !== 'small')
const cacheTtl = computed(() => {
  switch (componentSize.value) {
    case 'large': return 600000 // 10 minutes
    case 'medium': return 300000 // 5 minutes
    default: return 60000 // 1 minute
  }
})

const cacheKey = computed(() => 
  `${currentComponent.value?.name || 'unknown'}-${componentSize.value}`
)

const performancePlugins = [
  {
    name: 'performance-monitor',
    beforeRender(component, props, context) {
      if (componentSize.value === 'large') {
        context.utils.log('Loading large component, monitoring performance...')
      }
    },
    afterRender(component, props, context) {
      const duration = context.data.renderTime
      if (duration > 100) {
        context.utils.warn(`Slow render detected: ${duration}ms`)
      }
    }
  }
]
</script>
``` 