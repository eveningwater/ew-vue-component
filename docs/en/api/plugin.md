# Plugin API

## Overview

EwVueComponent provides a powerful plugin system that allows developers to extend component functionality, add custom behaviors such as logging, performance monitoring, error handling, and more.

## Plugin Structure

```typescript
interface Plugin {
  name: string
  beforeRender?: (component: any, props: any, context: PluginContext) => void
  afterRender?: (component: any, props: any, context: PluginContext) => void
  onError?: (error: Error, context: PluginContext) => void
  install?: (context: PluginContext) => void
  uninstall?: (context: PluginContext) => void
}

interface PluginContext {
  component: any
  data: Record<string, any>
  utils: {
    warn: (message: string) => void
    log: (message: string, data?: any) => void
  }
}
```

## Basic Plugins

### 1. Log Plugin

```javascript
const logPlugin = {
  name: 'log',
  
  beforeRender(component, props, context) {
    context.utils.log(`Starting to render component: ${component.name || component}`, {
      component,
      props: Object.keys(props)
    })
  },
  
  afterRender(component, props, context) {
    context.utils.log(`Component render completed: ${component.name || component}`)
  },
  
  onError(error, context) {
    context.utils.warn(`Component render error: ${error.message}`)
  }
}
```

### 2. Performance Plugin

```javascript
const performancePlugin = {
  name: 'performance',
  
  beforeRender(component, props, context) {
    performance.mark(`render-start-${component.name || 'unknown'}`)
    context.data.renderStartTime = performance.now()
  },
  
  afterRender(component, props, context) {
    const endTime = performance.now()
    const duration = endTime - context.data.renderStartTime
    
    performance.mark(`render-end-${component.name || 'unknown'}`)
    performance.measure(
      `render-${component.name || 'unknown'}`,
      `render-start-${component.name || 'unknown'}`,
      `render-end-${component.name || 'unknown'}`
    )
    
    context.utils.log(`Component render time: ${duration.toFixed(2)}ms`)
  }
}
```

### 3. Error Handling Plugin

```javascript
const errorPlugin = {
  name: 'error-handler',
  
  onError(error, context) {
    // Report error to server
    this.reportError(error, context)
    
    // Show user-friendly error message
    this.showUserError(error)
  },
  
  reportError(error, context) {
    // Send error to monitoring service
    console.error('Error reported:', {
      error: error.message,
      stack: error.stack,
      component: context.component,
      timestamp: new Date().toISOString()
    })
  },
  
  showUserError(error) {
    // Show user-friendly error message
    console.warn('Component loading failed, please try again later')
  }
}
```

## Using Plugins

### 1. Basic Usage

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin]"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

const logPlugin = {
  name: 'log',
  beforeRender(component, props, context) {
    console.log('Before render:', component, props)
  },
  afterRender(component, props, context) {
    console.log('After render:', component, props)
  }
}

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark('component-render-start')
  },
  afterRender(component, props, context) {
    performance.mark('component-render-end')
    performance.measure('component-render', 'component-render-start', 'component-render-end')
  }
}
</script>
```

### 2. Dynamic Plugin Management

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        <input v-model="enableLogging" type="checkbox" />
        Enable Logging
      </label>
      <label>
        <input v-model="enablePerformance" type="checkbox" />
        Enable Performance Monitoring
      </label>
      <label>
        <input v-model="enableErrorHandling" type="checkbox" />
        Enable Error Handling
      </label>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :plugins="activePlugins"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const enableLogging = ref(true)
const enablePerformance = ref(false)
const enableErrorHandling = ref(true)

const logPlugin = {
  name: 'log',
  beforeRender(component, props, context) {
    console.log('Before render:', component, props)
  },
  afterRender(component, props, context) {
    console.log('After render:', component, props)
  }
}

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark('component-render-start')
  },
  afterRender(component, props, context) {
    performance.mark('component-render-end')
    performance.measure('component-render', 'component-render-start', 'component-render-end')
  }
}

const errorPlugin = {
  name: 'error-handler',
  onError(error, context) {
    console.error('Component error:', error)
  }
}

const activePlugins = computed(() => {
  const plugins = []
  
  if (enableLogging.value) plugins.push(logPlugin)
  if (enablePerformance.value) plugins.push(performancePlugin)
  if (enableErrorHandling.value) plugins.push(errorPlugin)
  
  return plugins
})
</script>
```

### 3. Plugin Configuration

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="configuredPlugins"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// Configurable log plugin
const createLogPlugin = (options = {}) => ({
  name: 'log',
  beforeRender(component, props, context) {
    if (options.logBefore) {
      console.log('Before render:', component, props)
    }
  },
  afterRender(component, props, context) {
    if (options.logAfter) {
      console.log('After render:', component, props)
    }
  },
  onError(error, context) {
    if (options.logErrors) {
      console.error('Error:', error)
    }
  }
})

const configuredPlugins = [
  createLogPlugin({ logBefore: true, logAfter: true, logErrors: true }),
  createPerformancePlugin({ measureTime: true })
]
</script>
```

## Advanced Plugins

### 1. State Management Plugin

```javascript
const statePlugin = {
  name: 'state-manager',
  
  install(context) {
    // Initialize plugin state
    context.data.state = {
      renderCount: 0,
      lastRenderTime: null,
      errors: []
    }
  },
  
  beforeRender(component, props, context) {
    context.data.state.renderCount++
    context.data.state.lastRenderTime = new Date()
  },
  
  onError(error, context) {
    context.data.state.errors.push({
      message: error.message,
      timestamp: new Date(),
      component: context.component
    })
  },
  
  uninstall(context) {
    // Clean up plugin state
    console.log('Plugin state:', context.data.state)
    delete context.data.state
  }
}
```

### 2. Cache Plugin

```javascript
const cachePlugin = {
  name: 'cache-manager',
  
  install(context) {
    context.data.cache = new Map()
  },
  
  beforeRender(component, props, context) {
    const cacheKey = this.generateCacheKey(component, props)
    
    if (context.data.cache.has(cacheKey)) {
      // Use cached result
      const cachedResult = context.data.cache.get(cacheKey)
      context.utils.log('Using cached result:', cachedResult)
      return cachedResult
    }
  },
  
  afterRender(component, props, context) {
    const cacheKey = this.generateCacheKey(component, props)
    const result = { component, props, timestamp: Date.now() }
    
    context.data.cache.set(cacheKey, result)
    context.utils.log('Cached result:', result)
  },
  
  generateCacheKey(component, props) {
    return `${component.name || component}-${JSON.stringify(props)}`
  },
  
  uninstall(context) {
    context.data.cache.clear()
  }
}
```

### 3. Validation Plugin

```javascript
const validationPlugin = {
  name: 'validator',
  
  beforeRender(component, props, context) {
    // Validate component type
    if (!this.isValidComponent(component)) {
      throw new Error(`Invalid component type: ${component}`)
    }
    
    // Validate required props
    if (component.props) {
      this.validateProps(component.props, props)
    }
  },
  
  isValidComponent(component) {
    return typeof component === 'string' || 
           typeof component === 'function' || 
           (typeof component === 'object' && component.render)
  },
  
  validateProps(requiredProps, providedProps) {
    for (const [key, prop] of Object.entries(requiredProps)) {
      if (prop.required && !(key in providedProps)) {
        throw new Error(`Missing required prop: ${key}`)
      }
    }
  }
}
```

## Plugin Composition

### 1. Plugin Factory

```javascript
// plugins/factory.js
export const createPluginFactory = () => {
  const plugins = new Map()
  
  return {
    register(name, plugin) {
      plugins.set(name, plugin)
    },
    
    get(name) {
      return plugins.get(name)
    },
    
    create(config) {
      return Object.entries(config).map(([name, options]) => {
        const plugin = plugins.get(name)
        if (!plugin) {
          throw new Error(`Plugin not found: ${name}`)
        }
        return typeof plugin === 'function' ? plugin(options) : plugin
      })
    }
  }
}

// Usage example
const factory = createPluginFactory()

factory.register('log', (options) => ({
  name: 'log',
  beforeRender(component, props, context) {
    if (options.enabled) {
      console.log('Before render:', component, props)
    }
  }
}))

factory.register('performance', performancePlugin)

const plugins = factory.create({
  log: { enabled: true },
  performance: {}
})
```

### 2. Plugin Chain

```javascript
const pluginChain = {
  name: 'plugin-chain',
  
  install(context) {
    context.data.pluginChain = []
  },
  
  beforeRender(component, props, context) {
    // Execute plugin chain
    for (const plugin of context.data.pluginChain) {
      if (plugin.beforeRender) {
        plugin.beforeRender(component, props, context)
      }
    }
  },
  
  afterRender(component, props, context) {
    // Execute plugin chain in reverse order
    for (let i = context.data.pluginChain.length - 1; i >= 0; i--) {
      const plugin = context.data.pluginChain[i]
      if (plugin.afterRender) {
        plugin.afterRender(component, props, context)
      }
    }
  },
  
  addPlugin(plugin, context) {
    context.data.pluginChain.push(plugin)
  },
  
  removePlugin(pluginName, context) {
    context.data.pluginChain = context.data.pluginChain.filter(
      plugin => plugin.name !== pluginName
    )
  }
}
```

## Plugin Hooks

### beforeRender

Called before component rendering starts:

```javascript
const beforeRenderPlugin = {
  name: 'before-render',
  beforeRender(component, props, context) {
    // Prepare data
    context.data.startTime = Date.now()
    
    // Validate inputs
    if (!component) {
      throw new Error('Component is required')
    }
    
    // Log information
    context.utils.log('Starting render for:', component.name || component)
  }
}
```

### afterRender

Called after component rendering completes:

```javascript
const afterRenderPlugin = {
  name: 'after-render',
  afterRender(component, props, context) {
    // Calculate duration
    const duration = Date.now() - context.data.startTime
    
    // Log completion
    context.utils.log(`Render completed in ${duration}ms`)
    
    // Track analytics
    analytics.track('component_rendered', {
      component: component.name || component,
      duration,
      props: Object.keys(props)
    })
  }
}
```

### onError

Called when an error occurs during rendering:

```javascript
const errorHandlerPlugin = {
  name: 'error-handler',
  onError(error, context) {
    // Log error
    context.utils.warn('Render error:', error.message)
    
    // Report to monitoring service
    errorReporter.report(error, {
      component: context.component,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    })
    
    // Show user notification
    notificationService.show({
      type: 'error',
      message: 'Something went wrong. Please try again.',
      duration: 5000
    })
  }
}
```

## Best Practices

### 1. Plugin Naming

Use descriptive names and follow conventions:

```javascript
// Good
const userAnalyticsPlugin = { name: 'user-analytics' }
const performanceMonitorPlugin = { name: 'performance-monitor' }

// Bad
const plugin1 = { name: 'p1' }
const myPlugin = { name: 'plugin' }
```

### 2. Error Handling in Plugins

Always handle errors gracefully:

```javascript
const robustPlugin = {
  name: 'robust-plugin',
  
  beforeRender(component, props, context) {
    try {
      // Plugin logic here
      this.doSomething(component, props)
    } catch (error) {
      context.utils.warn('Plugin error:', error.message)
      // Don't let plugin errors break the component
    }
  },
  
  doSomething(component, props) {
    // Implementation
  }
}
```

### 3. Performance Considerations

Keep plugins lightweight and efficient:

```javascript
const efficientPlugin = {
  name: 'efficient-plugin',
  
  beforeRender(component, props, context) {
    // Only do work when necessary
    if (this.shouldProcess(component)) {
      this.process(component, props, context)
    }
  },
  
  shouldProcess(component) {
    // Quick check to avoid unnecessary work
    return component && typeof component === 'object'
  },
  
  process(component, props, context) {
    // Expensive operation only when needed
  }
}
```

### 4. Plugin Lifecycle Management

Properly manage plugin lifecycle:

```javascript
const lifecyclePlugin = {
  name: 'lifecycle-plugin',
  
  install(context) {
    // Initialize resources
    context.data.resources = this.createResources()
    console.log('Plugin installed')
  },
  
  beforeRender(component, props, context) {
    // Use resources
    context.data.resources.use()
  },
  
  uninstall(context) {
    // Clean up resources
    if (context.data.resources) {
      context.data.resources.cleanup()
      delete context.data.resources
    }
    console.log('Plugin uninstalled')
  },
  
  createResources() {
    return {
      use() { /* implementation */ },
      cleanup() { /* cleanup implementation */ }
    }
  }
}
``` 