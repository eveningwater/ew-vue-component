# Best Practices

This guide covers best practices for using EwVueComponent effectively in your Vue 3 applications.

## Performance Optimization

### 1. Efficient Component Caching

Use caching strategically for components that are expensive to create or load:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :cache="shouldCache"
    :cache-key="cacheKey"
    :cache-ttl="cacheTtl"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const componentType = ref('light') // light, medium, heavy

// Cache expensive components, skip caching for lightweight ones
const shouldCache = computed(() => componentType.value !== 'light')

// Use component size and unique identifier as cache key
const cacheKey = computed(() => `${componentType.value}-${componentId.value}`)

// Adjust TTL based on component characteristics
const cacheTtl = computed(() => {
  switch (componentType.value) {
    case 'heavy': return 600000 // 10 minutes for heavy components
    case 'medium': return 300000 // 5 minutes for medium components
    default: return 60000 // 1 minute for light components
  }
})
</script>
```

### 2. Lazy Loading Strategy

Implement progressive loading for better initial page performance:

```vue
<template>
  <div class="app">
    <!-- Critical components load immediately -->
    <EwVueComponent :is="HeaderComponent" />
    
    <!-- Non-critical components load on demand -->
    <EwVueComponent 
      v-if="showSidebar"
      :is="SidebarComponent"
      :cache="true"
    />
    
    <!-- Heavy components load when needed -->
    <EwVueComponent 
      v-if="showDashboard"
      :is="DashboardComponent"
      :cache="true"
      :plugins="[performancePlugin]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

// Immediate components
import HeaderComponent from '@/components/HeaderComponent.vue'

// Lazy-loaded components
const SidebarComponent = () => import('@/components/SidebarComponent.vue')
const DashboardComponent = () => import('@/components/DashboardComponent.vue')

const showSidebar = ref(false)
const showDashboard = ref(false)

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    console.time(`render-${component.name}`)
  },
  afterRender(component, props, context) {
    console.timeEnd(`render-${component.name}`)
  }
}
</script>
```

### 3. Component Preloading

Preload components that users are likely to interact with:

```javascript
// utils/componentPreloader.js
export class ComponentPreloader {
  constructor() {
    this.preloadQueue = new Set()
    this.loadedComponents = new Map()
  }

  async preload(componentLoaders, priority = 'low') {
    const promises = Object.entries(componentLoaders).map(async ([name, loader]) => {
      if (this.loadedComponents.has(name)) {
        return this.loadedComponents.get(name)
      }

      try {
        const component = await loader()
        this.loadedComponents.set(name, component)
        return component
      } catch (error) {
        console.warn(`Failed to preload component ${name}:`, error)
        return null
      }
    })

    if (priority === 'high') {
      return Promise.all(promises)
    } else {
      // Low priority: load during idle time
      return new Promise(resolve => {
        requestIdleCallback(() => {
          Promise.all(promises).then(resolve)
        })
      })
    }
  }

  get(name) {
    return this.loadedComponents.get(name)
  }
}

// Usage
const preloader = new ComponentPreloader()

// Preload critical components
preloader.preload({
  UserProfile: () => import('@/components/UserProfile.vue'),
  Settings: () => import('@/components/Settings.vue')
}, 'high')

// Preload non-critical components during idle time
preloader.preload({
  Dashboard: () => import('@/components/Dashboard.vue'),
  Reports: () => import('@/components/Reports.vue')
}, 'low')
```

## Error Handling Strategies

### 1. Graceful Degradation

Implement fallback mechanisms for robust applications:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="FallbackComponent"
    :error-component="ErrorComponent"
    @error="handleComponentError"
  >
    <!-- Always provide meaningful default content -->
    <template #default>
      <div class="default-content">
        <h3>Loading...</h3>
        <p>Please wait while we load the content.</p>
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)

// Simple fallback component
const FallbackComponent = {
  render() {
    return h('div', { class: 'fallback-component' }, [
      h('h3', 'Service Temporarily Unavailable'),
      h('p', 'We\'re working to restore this feature. Please try again later.'),
      h('button', { 
        onClick: () => window.location.reload(),
        class: 'retry-button'
      }, 'Refresh Page')
    ])
  }
}

// Detailed error component
const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return h('div', { class: 'error-boundary' }, [
      h('h3', 'Something went wrong'),
      h('p', 'We apologize for the inconvenience. The component failed to load.'),
      isDevelopment && h('details', [
        h('summary', 'Error Details (Development)'),
        h('pre', this.error?.stack || this.error?.message)
      ]),
      h('div', { class: 'error-actions' }, [
        h('button', { onClick: this.retry }, 'Try Again'),
        h('button', { 
          onClick: () => window.history.back(),
          class: 'secondary'
        }, 'Go Back')
      ])
    ])
  }
}

const handleComponentError = (error) => {
  // Log error for monitoring
  console.error('Component error:', error)
  
  // Report to error tracking service
  if (window.Sentry) {
    window.Sentry.captureException(error)
  }
  
  // Show user notification
  showNotification({
    type: 'error',
    message: 'Something went wrong. Please try refreshing the page.',
    duration: 5000
  })
}
</script>

<style scoped>
.fallback-component {
  padding: 2rem;
  text-align: center;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
}

.error-boundary {
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.retry-button,
.error-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-button {
  background: #f59e0b;
  color: white;
}

.error-actions button {
  background: #dc2626;
  color: white;
}

.error-actions button.secondary {
  background: #6b7280;
}
</style>
```

### 2. Error Monitoring and Analytics

Track component errors for continuous improvement:

```javascript
// utils/errorTracker.js
class ComponentErrorTracker {
  constructor(options = {}) {
    this.endpoint = options.endpoint || '/api/errors'
    this.enabled = options.enabled !== false
    this.maxRetries = options.maxRetries || 3
    this.retryDelay = options.retryDelay || 1000
  }

  async track(error, context) {
    if (!this.enabled) return

    const errorData = {
      message: error.message,
      stack: error.stack,
      component: context.component?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildVersion: process.env.VUE_APP_VERSION
    }

    await this.sendWithRetry(errorData)
  }

  async sendWithRetry(data, attempt = 1) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      if (attempt < this.maxRetries) {
        setTimeout(() => {
          this.sendWithRetry(data, attempt + 1)
        }, this.retryDelay * attempt)
      } else {
        console.warn('Failed to send error report after', this.maxRetries, 'attempts')
      }
    }
  }

  getCurrentUserId() {
    // Implement based on your auth system
    return localStorage.getItem('userId') || 'anonymous'
  }

  getSessionId() {
    // Implement session tracking
    return sessionStorage.getItem('sessionId') || 'unknown'
  }
}

// Usage
const errorTracker = new ComponentErrorTracker({
  endpoint: '/api/component-errors',
  enabled: process.env.NODE_ENV === 'production'
})

export { errorTracker }
```

## Code Organization

### 1. Component Mapping Strategy

Organize components systematically:

```javascript
// config/componentMap.js
export const componentMap = {
  // Core UI components
  ui: {
    Button: () => import('@/components/ui/Button.vue'),
    Modal: () => import('@/components/ui/Modal.vue'),
    Table: () => import('@/components/ui/Table.vue')
  },
  
  // Feature-specific components
  user: {
    Profile: () => import('@/components/user/Profile.vue'),
    Settings: () => import('@/components/user/Settings.vue'),
    Avatar: () => import('@/components/user/Avatar.vue')
  },
  
  // Page components
  pages: {
    Dashboard: () => import('@/pages/Dashboard.vue'),
    Analytics: () => import('@/pages/Analytics.vue'),
    Reports: () => import('@/pages/Reports.vue')
  },
  
  // Admin components (role-based)
  admin: {
    UserManagement: () => import('@/components/admin/UserManagement.vue'),
    SystemSettings: () => import('@/components/admin/SystemSettings.vue')
  }
}

// Component resolver utility
export class ComponentResolver {
  constructor(componentMap) {
    this.componentMap = componentMap
  }

  resolve(path) {
    const [category, component] = path.split('.')
    
    if (!this.componentMap[category]) {
      throw new Error(`Component category "${category}" not found`)
    }
    
    if (!this.componentMap[category][component]) {
      throw new Error(`Component "${component}" not found in category "${category}"`)
    }
    
    return this.componentMap[category][component]
  }

  list(category) {
    return Object.keys(this.componentMap[category] || {})
  }

  listCategories() {
    return Object.keys(this.componentMap)
  }
}

// Usage
const resolver = new ComponentResolver(componentMap)

// In your component
const currentComponent = ref(resolver.resolve('user.Profile'))
```

### 2. Plugin Architecture

Create reusable plugin systems:

```javascript
// plugins/index.js
import { developmentPlugin } from './development'
import { productionPlugin } from './production'
import { analyticsPlugin } from './analytics'
import { accessibilityPlugin } from './accessibility'

export class PluginManager {
  constructor() {
    this.plugins = new Map()
    this.contexts = new WeakMap()
  }

  register(name, plugin) {
    this.plugins.set(name, plugin)
  }

  createContext(environment = 'development') {
    const plugins = []

    // Environment-specific plugins
    if (environment === 'development') {
      plugins.push(developmentPlugin)
    } else {
      plugins.push(productionPlugin)
    }

    // Universal plugins
    plugins.push(analyticsPlugin, accessibilityPlugin)

    return plugins
  }

  get(name) {
    return this.plugins.get(name)
  }
}

// Environment-specific plugin configurations
export const createPluginConfig = (env) => {
  const manager = new PluginManager()
  
  // Register all available plugins
  manager.register('development', developmentPlugin)
  manager.register('production', productionPlugin)
  manager.register('analytics', analyticsPlugin)
  manager.register('accessibility', accessibilityPlugin)
  
  return manager.createContext(env)
}
```

## Testing Strategies

### 1. Component Testing

Test dynamic component behavior:

```javascript
// tests/EwVueComponent.test.js
import { mount } from '@vue/test-utils'
import { EwVueComponent } from 'ew-vue-component'
import { describe, it, expect, vi } from 'vitest'

describe('EwVueComponent', () => {
  it('should render string components', () => {
    const wrapper = mount(EwVueComponent, {
      props: { is: 'div' }
    })
    
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('should forward props correctly', () => {
    const wrapper = mount(EwVueComponent, {
      props: { 
        is: 'button',
        disabled: true,
        type: 'submit'
      }
    })
    
    expect(wrapper.element.disabled).toBe(true)
    expect(wrapper.element.type).toBe('submit')
  })

  it('should handle component loading errors', async () => {
    const onError = vi.fn()
    const wrapper = mount(EwVueComponent, {
      props: { 
        is: 'NonExistentComponent'
      },
      listeners: {
        error: onError
      }
    })

    // Wait for error to be thrown
    await wrapper.vm.$nextTick()
    
    expect(onError).toHaveBeenCalled()
  })

  it('should use fallback when component fails', async () => {
    const wrapper = mount(EwVueComponent, {
      props: { 
        is: 'BrokenComponent',
        fallback: 'div'
      }
    })

    await wrapper.vm.$nextTick()
    
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('should execute plugins in correct order', async () => {
    const callOrder = []
    
    const plugin1 = {
      name: 'plugin1',
      beforeRender: () => callOrder.push('plugin1-before'),
      afterRender: () => callOrder.push('plugin1-after')
    }
    
    const plugin2 = {
      name: 'plugin2',
      beforeRender: () => callOrder.push('plugin2-before'),
      afterRender: () => callOrder.push('plugin2-after')
    }

    mount(EwVueComponent, {
      props: { 
        is: 'div',
        plugins: [plugin1, plugin2]
      }
    })

    await nextTick()
    
    expect(callOrder).toEqual([
      'plugin1-before',
      'plugin2-before',
      'plugin1-after',
      'plugin2-after'
    ])
  })
})
```

### 2. Integration Testing

Test component behavior in real scenarios:

```javascript
// tests/integration/DynamicComponentApp.test.js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import DynamicComponentApp from '@/components/DynamicComponentApp.vue'

describe('DynamicComponentApp Integration', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(DynamicComponentApp, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
  })

  it('should switch between components correctly', async () => {
    // Initial state
    expect(wrapper.find('[data-testid="current-component"]').text())
      .toBe('Dashboard')

    // Switch to user profile
    await wrapper.find('[data-testid="profile-button"]').trigger('click')
    
    expect(wrapper.find('[data-testid="current-component"]').text())
      .toBe('UserProfile')

    // Verify component props are passed
    expect(wrapper.find('[data-testid="user-name"]').text())
      .toBe('John Doe')
  })

  it('should handle async component loading', async () => {
    // Show loading state
    await wrapper.find('[data-testid="reports-button"]').trigger('click')
    
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    
    // Wait for async component to load
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="reports-component"]').exists()).toBe(true)
  })
})
```

## Security Considerations

### 1. Component Validation

Validate components before rendering:

```javascript
// utils/componentValidator.js
export class ComponentValidator {
  constructor(options = {}) {
    this.allowedTags = options.allowedTags || ['div', 'span', 'p', 'h1', 'h2', 'h3']
    this.blockedComponents = options.blockedComponents || []
    this.requireWhitelist = options.requireWhitelist || false
    this.whitelistedComponents = options.whitelistedComponents || []
  }

  validate(component) {
    // Check for blocked components
    if (this.isBlocked(component)) {
      throw new Error(`Component "${component}" is not allowed`)
    }

    // Check whitelist if required
    if (this.requireWhitelist && !this.isWhitelisted(component)) {
      throw new Error(`Component "${component}" is not in whitelist`)
    }

    // Validate string components (HTML tags)
    if (typeof component === 'string') {
      return this.validateTag(component)
    }

    // Validate component objects
    if (typeof component === 'object') {
      return this.validateComponentObject(component)
    }

    return true
  }

  isBlocked(component) {
    const name = this.getComponentName(component)
    return this.blockedComponents.includes(name)
  }

  isWhitelisted(component) {
    const name = this.getComponentName(component)
    return this.whitelistedComponents.includes(name)
  }

  validateTag(tag) {
    if (!this.allowedTags.includes(tag)) {
      throw new Error(`HTML tag "${tag}" is not allowed`)
    }
    return true
  }

  validateComponentObject(component) {
    // Check for suspicious properties
    const suspiciousProps = ['__proto__', 'constructor', 'prototype']
    
    for (const prop of suspiciousProps) {
      if (prop in component) {
        throw new Error(`Suspicious property "${prop}" found in component`)
      }
    }

    return true
  }

  getComponentName(component) {
    if (typeof component === 'string') {
      return component
    }
    if (typeof component === 'object' && component.name) {
      return component.name
    }
    return 'Unknown'
  }
}

// Usage with EwVueComponent
const validator = new ComponentValidator({
  allowedTags: ['div', 'span', 'p', 'button', 'input'],
  blockedComponents: ['ScriptComponent', 'UnsafeComponent'],
  requireWhitelist: true,
  whitelistedComponents: ['UserProfile', 'Dashboard', 'Settings']
})

const validationPlugin = {
  name: 'validator',
  beforeRender(component, props, context) {
    try {
      validator.validate(component)
    } catch (error) {
      context.utils.warn('Component validation failed:', error.message)
      throw error
    }
  }
}
```

### 2. Secure Props Handling

Sanitize and validate props:

```javascript
// utils/propsSanitizer.js
import DOMPurify from 'dompurify'

export class PropsSanitizer {
  constructor(options = {}) {
    this.sanitizeHtml = options.sanitizeHtml !== false
    this.allowedEvents = options.allowedEvents || [
      'onClick', 'onInput', 'onChange', 'onSubmit', 'onFocus', 'onBlur'
    ]
    this.blockedProps = options.blockedProps || [
      'innerHTML', 'outerHTML', 'dangerouslySetInnerHTML'
    ]
  }

  sanitize(props) {
    const sanitized = {}

    for (const [key, value] of Object.entries(props)) {
      // Block dangerous props
      if (this.blockedProps.includes(key)) {
        console.warn(`Blocked dangerous prop: ${key}`)
        continue
      }

      // Validate event handlers
      if (key.startsWith('on') && !this.allowedEvents.includes(key)) {
        console.warn(`Blocked event handler: ${key}`)
        continue
      }

      // Sanitize HTML content
      if (this.shouldSanitizeValue(key, value)) {
        sanitized[key] = this.sanitizeValue(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  shouldSanitizeValue(key, value) {
    return this.sanitizeHtml && 
           typeof value === 'string' && 
           (key.includes('html') || key.includes('content'))
  }

  sanitizeValue(value) {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value)
    }
    return value
  }
}

// Usage
const sanitizer = new PropsSanitizer()

const sanitizationPlugin = {
  name: 'sanitizer',
  beforeRender(component, props, context) {
    const sanitizedProps = sanitizer.sanitize(props)
    
    // Replace props with sanitized version
    Object.assign(props, sanitizedProps)
  }
}
```

## Performance Monitoring

### 1. Real-time Performance Tracking

Monitor component performance in production:

```javascript
// utils/performanceMonitor.js
export class PerformanceMonitor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false
    this.slowThreshold = options.slowThreshold || 100
    this.verySlowThreshold = options.verySlowThreshold || 500
    this.reportingEndpoint = options.reportingEndpoint
    this.sampleRate = options.sampleRate || 0.1 // 10% sampling
  }

  measureComponent(componentName, measureFn) {
    if (!this.enabled || !this.shouldSample()) {
      return measureFn()
    }

    const startTime = performance.now()
    const startMark = `${componentName}-start`
    const endMark = `${componentName}-end`
    
    performance.mark(startMark)

    try {
      const result = measureFn()
      
      if (result && typeof result.then === 'function') {
        // Handle async components
        return result.then(
          (value) => {
            this.finalizeMeasurement(componentName, startTime, startMark, endMark)
            return value
          },
          (error) => {
            this.finalizeMeasurement(componentName, startTime, startMark, endMark, error)
            throw error
          }
        )
      } else {
        this.finalizeMeasurement(componentName, startTime, startMark, endMark)
        return result
      }
    } catch (error) {
      this.finalizeMeasurement(componentName, startTime, startMark, endMark, error)
      throw error
    }
  }

  finalizeMeasurement(componentName, startTime, startMark, endMark, error = null) {
    const endTime = performance.now()
    const duration = endTime - startTime

    performance.mark(endMark)
    performance.measure(componentName, startMark, endMark)

    const performanceData = {
      component: componentName,
      duration,
      timestamp: new Date().toISOString(),
      error: error ? error.message : null,
      slow: duration > this.slowThreshold,
      verySlow: duration > this.verySlowThreshold
    }

    // Log slow components
    if (duration > this.slowThreshold) {
      console.warn(`Slow component detected: ${componentName} (${duration.toFixed(2)}ms)`)
    }

    // Report to analytics
    this.reportPerformance(performanceData)
  }

  shouldSample() {
    return Math.random() < this.sampleRate
  }

  async reportPerformance(data) {
    if (!this.reportingEndpoint) return

    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.warn('Failed to report performance data:', error)
    }
  }
}

// Usage
const monitor = new PerformanceMonitor({
  slowThreshold: 100,
  verySlowThreshold: 500,
  reportingEndpoint: '/api/performance',
  sampleRate: 0.05 // 5% sampling in production
})

export { monitor }
```

This comprehensive best practices guide covers the most important aspects of using EwVueComponent effectively, including performance optimization, error handling, code organization, testing, security, and monitoring. Following these practices will help you build robust, performant, and maintainable Vue 3 applications. 