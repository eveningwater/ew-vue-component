---
layout: home
hero:
  name: EwVueComponent
  text: Powerful Vue 3 Dynamic Component Wrapper
  tagline: Easily implement dynamic component switching, error handling, and performance optimization
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/
    - theme: alt
      text: View Examples
      link: /en/examples/
features:
  - icon: 🚀
    title: High Performance
    details: Built on Vue 3 Composition API with reactive updates and intelligent caching
  - icon: 🛡️
    title: Type Safe
    details: Full TypeScript support with excellent developer experience and type hints
  - icon: 🔧
    title: Easy to Use
    details: Clean API design that enables complex dynamic component functionality in just a few lines
  - icon: 🎯
    title: Error Handling
    details: Built-in error boundaries and fallback handling for application stability
  - icon: 📦
    title: Lightweight
    details: Minimal bundle size with no additional dependencies
  - icon: 🌍
    title: Ecosystem Friendly
    details: Perfect compatibility with Vue 3 ecosystem and all major build tools
---

# EwVueComponent

A powerful Vue 3 dynamic component library that makes component switching, async loading, and error handling effortless.

## 🚀 Features

### Core Capabilities
- **Dynamic Component Switching**: Seamlessly switch between strings, component objects, and async components
- **Intelligent Error Handling**: Built-in error boundaries with automatic fallback to backup components and retry mechanisms
- **Performance Optimization**: Component caching, performance monitoring, and intelligent loading
- **Type Safety**: Complete TypeScript support for excellent development experience
- **Plugin System**: Extensible plugin architecture with built-in logging, performance, and error handling plugins

### Advanced Features
- **Async Component Support**: Code splitting and lazy loading with loading states
- **Component Caching**: Local and global caching with TTL support
- **Error Recovery**: Automatic retry mechanisms and custom error components
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Props/Events/Slots Forwarding**: Complete transparency for component integration

## 📦 Installation

```bash
# npm
npm install ew-vue-component

# yarn
yarn add ew-vue-component

# pnpm
pnpm add ew-vue-component
```

## 🎯 Quick Start

### 1. Basic Usage

```vue
<template>
  <div>
    <!-- String component (HTML tag) -->
    <EwVueComponent is="button" @click="handleClick">
      Click me!
    </EwVueComponent>
    
    <!-- Vue component -->
    <EwVueComponent :is="MyComponent" :title="title" />
    
    <!-- Async component -->
    <EwVueComponent :is="asyncComponent" @error="handleError" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import MyComponent from './MyComponent.vue'

const title = ref('Hello World')
const asyncComponent = () => import('./AsyncComponent.vue')

const handleClick = () => {
  console.log('Button clicked!')
}

const handleError = (error) => {
  console.error('Component failed to load:', error)
}
</script>
```

### 2. With Error Handling

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="FallbackComponent"
    :error-component="ErrorComponent"
    @error="handleError"
  >
    <template #default>
      <p>Loading...</p>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('UnstableComponent')

const FallbackComponent = {
  render() {
    return h('div', 'Fallback content when component fails')
  }
}

const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    return h('div', [
      h('h3', 'Something went wrong'),
      h('p', this.error?.message),
      h('button', { onClick: this.retry }, 'Retry')
    ])
  }
}

const handleError = (error) => {
  console.error('Component error:', error)
  // Send to error monitoring service
}
</script>
```

### 3. With Performance Optimization

```vue
<template>
  <EwVueComponent 
    :is="heavyComponent"
    :cache="true"
    :cache-key="cacheKey"
    :cache-ttl="300000"
    :plugins="[performancePlugin, logPlugin]"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const heavyComponent = () => import('./HeavyComponent.vue')
const componentId = ref('heavy-1')

const cacheKey = computed(() => `heavy-component-${componentId.value}`)

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

const logPlugin = {
  name: 'logger',
  beforeRender(component, props, context) {
    console.log('Rendering component:', component.name || component)
  }
}
</script>
```

## 🔧 Component Types

EwVueComponent supports multiple component types:

| Type | Example | Use Case |
|------|---------|----------|
| **String** | `"div"`, `"button"` | HTML tags, simple elements |
| **Component** | `MyComponent` | Regular Vue components |
| **Async Function** | `() => import('./Async.vue')` | Code splitting, lazy loading |
| **Component Object** | `{ render() { ... } }` | Dynamic render functions |

## 🛡️ Error Handling

### Error Events
```vue
<EwVueComponent 
  :is="component"
  @error="handleError"
/>
```

### Fallback Components
```vue
<EwVueComponent 
  :is="component"
  fallback="div"
/>
```

### Custom Error Components
```vue
<EwVueComponent 
  :is="component"
  :error-component="CustomErrorComponent"
/>
```

## ⚡ Performance Features

### Component Caching
```vue
<EwVueComponent 
  :is="component"
  :cache="true"
  :cache-key="uniqueKey"
  :cache-ttl="300000"
/>
```

### Performance Monitoring
```vue
<EwVueComponent 
  :is="component"
  :plugins="[performancePlugin]"
/>
```

## 🔌 Plugin System

### Built-in Plugins
- **Log Plugin**: Component lifecycle logging
- **Performance Plugin**: Render time monitoring
- **Error Plugin**: Advanced error handling and reporting

### Custom Plugins
```javascript
const customPlugin = {
  name: 'my-plugin',
  beforeRender(component, props, context) {
    // Before render logic
  },
  afterRender(component, props, context) {
    // After render logic
  },
  onError(error, context) {
    // Error handling logic
  }
}
```

## 📖 Documentation

### Guides
- [Getting Started](/en/guide/) - Basic usage and concepts
- [Basic Usage](/en/guide/basic-usage) - Detailed usage examples
- [Advanced Features](/en/guide/advanced-features) - Advanced patterns and techniques
- [Best Practices](/en/guide/best-practices) - Recommended patterns and optimizations

### API Reference
- [Component API](/en/api/component) - Complete component API reference
- [Plugin API](/en/api/plugin) - Plugin development guide
- [Utils API](/en/api/utils) - Utility functions and helpers

### Examples
- [Basic Examples](/en/examples/basic) - Simple usage examples
- [Dynamic Examples](/en/examples/dynamic) - Complex dynamic scenarios
- [Error Handling](/en/examples/error-handling) - Error handling patterns

## 🌟 Use Cases

### Dynamic Forms
Build forms with dynamic field types based on configuration:

```vue
<EwVueComponent 
  v-for="field in formFields"
  :key="field.id"
  :is="field.component"
  v-bind="field.props"
  @input="updateField(field.id, $event)"
/>
```

### Micro-frontends
Load remote components dynamically:

```vue
<EwVueComponent 
  :is="() => loadRemoteComponent(appUrl)"
  :cache="true"
  @error="handleMicrofrontendError"
/>
```

### Content Management
Render dynamic content based on CMS data:

```vue
<EwVueComponent 
  v-for="block in contentBlocks"
  :key="block.id"
  :is="componentMap[block.type]"
  v-bind="block.props"
/>
```

### A/B Testing
Switch between component variants:

```vue
<EwVueComponent 
  :is="experimentVariant"
  :plugins="[analyticsPlugin]"
/>
```

## 🚀 Why EwVueComponent?

### Traditional Approach
```vue
<template>
  <div>
    <ComponentA v-if="type === 'a'" v-bind="props" />
    <ComponentB v-else-if="type === 'b'" v-bind="props" />
    <ComponentC v-else-if="type === 'c'" v-bind="props" />
    <!-- Manual error handling for each component -->
  </div>
</template>
```

### With EwVueComponent
```vue
<template>
  <EwVueComponent 
    :is="componentMap[type]"
    v-bind="props"
    :fallback="FallbackComponent"
    @error="handleError"
  />
</template>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/eveningwater/ew-vue-component/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/eveningwater/ew-vue-component.git

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build
```

## 📄 License

MIT License - see the [LICENSE](https://github.com/eveningwater/ew-vue-component/blob/main/LICENSE) file for details.

## 💡 Support

- 📖 [Documentation](https://eveningwater.github.io/ew-vue-component/docs/)
- 🐛 [Issue Tracker](https://github.com/eveningwater/ew-vue-component/issues)
- 💬 [Discussions](https://github.com/eveningwater/ew-vue-component/discussions)
- 📧 [Email Support](mailto:854806732@qq.com)

---

<p align="center">
  Made with ❤️ by the EwVueComponent team
</p> 