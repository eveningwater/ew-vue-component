# EwVueComponent

A powerful and flexible Vue 3 component wrapper that enables safe dynamic component rendering with comprehensive error handling, performance optimization, and plugin support.

[![npm version](https://badge.fury.io/js/ew-vue-component.svg)](https://badge.fury.io/js/ew-vue-component)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Features

- **🔄 Dynamic Component Rendering**: Seamlessly render strings, Vue components, async components, and component objects
- **🛡️ Error Boundary**: Built-in error handling with automatic fallback to default slots
- **⚡ Performance Optimized**: Component caching, lazy loading, and performance monitoring
- **🔌 Plugin System**: Extensible architecture with built-in plugins for logging, performance, and error handling
- **📦 TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **🎯 Slot Forwarding**: Complete slot forwarding including named and scoped slots
- **🔧 Props/Events Forwarding**: Automatic forwarding of all props and events to target components
- **🚫 Zero Dependencies**: Lightweight with no external dependencies

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

### Global Registration

```javascript
import { createApp } from "vue";
import EwVueComponent from "ew-vue-component";
import App from "./App.vue";

const app = createApp(App);
app.use(EwVueComponent);
app.mount("#app");
```

### Per-Component Import

```javascript
import { EwVueComponent } from "ew-vue-component";

export default {
  components: {
    EwVueComponent,
  },
};
```

### Composition API

```vue
<script setup>
import { EwVueComponent } from "ew-vue-component";
</script>
```

## 💡 Basic Usage

### String Components (HTML Tags)

```vue
<template>
  <!-- Render HTML elements -->
  <EwVueComponent is="div" class="container">
    <p>Hello World</p>
  </EwVueComponent>

  <!-- Dynamic tag switching -->
  <EwVueComponent :is="currentTag" @click="handleClick">
    Dynamic content
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const currentTag = ref('button');

const handleClick = () => {
  currentTag.value = currentTag.value === 'button' ? 'div' : 'button';
};
</script>
```

### Vue Components

```vue
<template>
  <!-- Render Vue components -->
  <EwVueComponent :is="MyComponent" :title="title">
    <template #default>
      <span>Slot content</span>
    </template>
  </EwVueComponent>

  <!-- Component switching -->
  <EwVueComponent :is="currentComponent" v-bind="componentProps" />
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';
import MyComponent from './MyComponent.vue';
import AnotherComponent from './AnotherComponent.vue';

const title = ref('Dynamic Title');
const currentComponent = ref(MyComponent);
const componentProps = ref({ title: 'Hello' });

// Switch components
const switchComponent = () => {
  currentComponent.value = currentComponent.value === MyComponent 
    ? AnotherComponent 
    : MyComponent;
};
</script>
```

### Async Components

```vue
<template>
  <!-- Async component loading -->
  <EwVueComponent 
    :is="asyncComponent" 
    @error="handleError"
  >
    <div class="loading">Loading...</div>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const asyncComponent = ref(() => import('./AsyncComponent.vue'));

const handleError = (error) => {
  console.error('Component failed to load:', error);
};
</script>
```

## 🛡️ Error Handling

### Basic Error Handling

```vue
<template>
  <!-- Error boundary with fallback -->
  <EwVueComponent 
    :is="maybeInvalidComponent"
    @error="handleError"
  >
    <div class="fallback">
      ⚠️ Component failed to load
    </div>
  </EwVueComponent>
</template>

<script setup>
import { EwVueComponent } from 'ew-vue-component';

const handleError = (error) => {
  console.error('Component error:', error);
  // Send to error monitoring service
};
</script>
```

### Advanced Error Handling

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="FallbackComponent"
    :error-component="ErrorComponent"
    @error="handleError"
  />
</template>

<script setup>
import { ref, h } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const currentComponent = ref('UnstableComponent');

const FallbackComponent = {
  render() {
    return h('div', { class: 'fallback' }, 'Fallback content');
  }
};

const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    return h('div', { class: 'error-boundary' }, [
      h('h3', 'Something went wrong'),
      h('p', this.error?.message),
      h('button', { onClick: this.retry }, 'Retry')
    ]);
  }
};
</script>
```

## ⚡ Performance Features

### Component Caching

```vue
<template>
  <EwVueComponent 
    :is="heavyComponent"
    :cache="true"
    :cache-key="cacheKey"
    :cache-ttl="300000"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const heavyComponent = () => import('./HeavyComponent.vue');
const componentId = ref('heavy-1');

const cacheKey = computed(() => `heavy-component-${componentId.value}`);
</script>
```

### Performance Monitoring

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[performancePlugin]"
  />
</template>

<script setup>
import { EwVueComponent } from 'ew-vue-component';

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    performance.mark('component-render-start');
  },
  afterRender(component, props, context) {
    performance.mark('component-render-end');
    performance.measure('component-render', 'component-render-start', 'component-render-end');
  }
};
</script>
```

## 🔌 Plugin System

### Built-in Plugins

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin, errorPlugin]"
  />
</template>

<script setup>
import { EwVueComponent, logPlugin, performancePlugin, errorPlugin } from 'ew-vue-component';
</script>
```

### Custom Plugins

```javascript
const customPlugin = {
  name: 'analytics',
  beforeRender(component, props, context) {
    // Track component render start
    analytics.track('component_render_start', {
      component: component.name || component
    });
  },
  afterRender(component, props, context) {
    // Track component render complete
    analytics.track('component_render_complete');
  },
  onError(error, context) {
    // Track component errors
    analytics.track('component_error', {
      error: error.message,
      component: context.component
    });
  }
};
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `is` | `string \| Component \| (() => Promise<Component>)` | - | **Required**. The component to render |
| `fallback` | `string \| Component` | `undefined` | Fallback component when main component fails |
| `errorComponent` | `Component` | `undefined` | Custom error component |
| `cache` | `boolean` | `false` | Enable component caching |
| `cacheKey` | `string` | `''` | Custom cache key |
| `cacheTtl` | `number` | `300000` | Cache TTL in milliseconds |
| `plugins` | `Plugin[]` | `[]` | Array of plugins |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `error` | `(error: Error)` | Emitted when component rendering fails |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Default slot content, also used as fallback |
| `*` | All slots are forwarded to the target component |

## 🎨 Use Cases

### Dynamic Forms

```vue
<template>
  <form>
    <EwVueComponent 
      v-for="field in formFields"
      :key="field.id"
      :is="field.component"
      v-bind="field.props"
      @input="updateField(field.id, $event)"
    />
  </form>
</template>
```

### Micro-frontends

```vue
<template>
  <EwVueComponent 
    :is="() => loadRemoteComponent(moduleUrl)"
    :cache="true"
    @error="handleMicrofrontendError"
  />
</template>
```

### Content Management Systems

```vue
<template>
  <div>
    <EwVueComponent 
      v-for="block in contentBlocks"
      :key="block.id"
      :is="componentMap[block.type]"
      v-bind="block.props"
    />
  </div>
</template>
```

### A/B Testing

```vue
<template>
  <EwVueComponent 
    :is="experimentVariant"
    :plugins="[analyticsPlugin]"
  />
</template>
```

## 🔧 TypeScript Support

```typescript
import { EwVueComponent } from 'ew-vue-component';
import type { ComponentType, Plugin } from 'ew-vue-component';

// Type-safe component usage
const MyComponent: ComponentType = {
  render() {
    return h('div', 'Typed component');
  }
};

// Type-safe plugin
const myPlugin: Plugin = {
  name: 'my-plugin',
  beforeRender(component, props, context) {
    // Fully typed context
    context.utils.log('Rendering component');
  }
};
```

## 📖 Documentation

For comprehensive documentation, examples, and guides, visit:

- 📚 [Full Documentation](./docs/en/index.md)
- 🚀 [Getting Started](./docs/en/guide/index.md)
- 📖 [API Reference](./docs/en/api/index.md)
- 💡 [Examples](./docs/en/examples/index.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.en) for details.

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

# Run documentation locally
pnpm docs:dev
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

## 📦 Browser Support

- **Vue 3.x**: Full support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **TypeScript**: 4.0+
- **Node.js**: 14+

## 📄 License

[MIT](./LICENSE) License © 2024-present [eveningwater](https://github.com/eveningwater)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=eveningwater/ew-vue-component&type=Date)](https://star-history.com/#eveningwater/ew-vue-component&Date)

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/eveningwater">eveningwater</a></sub>
</p> 