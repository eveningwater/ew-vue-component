# EwVueComponent API

## Overview

EwVueComponent is a powerful Vue 3 dynamic component wrapper that supports dynamic switching between multiple component types, including HTML tags, Vue components, async components, and component objects.

## Basic Usage

```vue
<!-- HTML tag -->
<EwVueComponent is="div" />

<!-- Vue component -->
<EwVueComponent :is="MyComponent" />

<!-- Component object -->
<EwVueComponent :is="componentObject" />

<!-- Async component -->
<EwVueComponent :is="asyncComponent" />
```

## Props

### is

- **Type**: `string | Component | ComponentObject | (() => Promise<Component>)`
- **Required**: Yes
- **Description**: The component type to render

```vue
<template>
  <!-- String component (HTML tag) -->
  <EwVueComponent is="div" />
  
  <!-- Vue component -->
  <EwVueComponent :is="MyComponent" />
  
  <!-- Component object -->
  <EwVueComponent :is="componentObject" />
  
  <!-- Async component -->
  <EwVueComponent :is="asyncComponent" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

// Vue component
const MyComponent = {
  name: 'MyComponent',
  template: '<div>Hello World</div>'
}

// Component object
const componentObject = {
  render() {
    return h('div', 'Hello from render function')
  }
}

// Async component
const asyncComponent = () => import('./MyAsyncComponent.vue')
</script>
```

### fallback

- **Type**: `string | Component | ComponentObject`
- **Default**: `undefined`
- **Description**: Fallback component to use when the main component fails to load

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    fallback="div"
  >
    <template #default>
      <p>Main content</p>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('UnstableComponent')
</script>
```

### errorComponent

- **Type**: `string | Component | ComponentObject`
- **Default**: `undefined`
- **Description**: Custom error component

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :error-component="ErrorComponent"
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const ErrorComponent = {
  render() {
    return h('div', { class: 'error' }, [
      h('h3', 'Component Loading Failed'),
      h('p', 'Please try again later')
    ])
  }
}
</script>
```

### cache

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether to enable component caching

### cacheKey

- **Type**: `string`
- **Default**: `''`
- **Description**: Custom cache key

### cacheTtl

- **Type**: `number`
- **Default**: `300000` (5 minutes)
- **Description**: Cache time-to-live in milliseconds

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :cache="true"
    cache-key="my-component"
    :cache-ttl="600000"
  />
</template>
```

### plugins

- **Type**: `Plugin[]`
- **Default**: `[]`
- **Description**: Array of plugins to use

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin]"
  />
</template>
```

## Props and Attrs Forwarding

EwVueComponent automatically forwards all props (except `is`, `fallback`, `errorComponent`, `cache`, `cacheKey`, `cacheTtl`, `plugins`) and attrs to the target component:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    class="my-component"
    data-testid="test-component"
    @click="handleClick"
    @input="handleInput"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('button')
const title = ref('Click me')
const count = ref(0)
const disabled = ref(false)

const handleClick = () => {
  count.value++
}

const handleInput = (value) => {
  console.log('Input:', value)
}
</script>
```

## Slot Forwarding

EwVueComponent supports all types of slot forwarding:

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <!-- Default slot -->
    <template #default>
      <p>Default content</p>
    </template>
    
    <!-- Named slots -->
    <template #header>
      <h2>Header content</h2>
    </template>
    
    <!-- Scoped slots -->
    <template #item="{ data, index }">
      <div class="item">
        {{ index + 1 }}. {{ data.title }}
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ListItem')
</script>
```

## Event Forwarding

All events are automatically forwarded to the target component:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('input')

const handleClick = (event) => {
  console.log('Click event:', event)
}

const handleInput = (event) => {
  console.log('Input event:', event.target.value)
}

const handleChange = (event) => {
  console.log('Change event:', event.target.value)
}

const handleSubmit = (event) => {
  console.log('Submit event:', event)
  event.preventDefault()
}
</script>
```

## Events

### error

- **Type**: `(error: Error) => void`
- **Description**: Triggered when component rendering encounters an error

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

const currentComponent = ref('BrokenComponent')

const handleError = (error) => {
  console.error('Component error:', error)
  // Handle error here, such as showing error message, reporting error, etc.
}
</script>
```

## Component Types

### HTML Tags

```vue
<template>
  <EwVueComponent is="div" class="container">
    <p>This is a div element</p>
  </EwVueComponent>
</template>
```

### Vue Components

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

### Component Objects

```vue
<template>
  <EwVueComponent :is="componentObject" />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const componentObject = ref({
  render() {
    return h('div', { class: 'custom-component' }, 'Dynamically created component')
  }
})
</script>
```

### Async Components

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

## Error Handling

### Basic Error Handling

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

const currentComponent = ref('BrokenComponent')

const handleError = (error) => {
  console.error('Component error:', error)
  // Fallback to safe component
  currentComponent.value = 'div'
}
</script>
```

### Using Fallback Components

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :fallback="FallbackComponent"
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const FallbackComponent = {
  render() {
    return h('div', { class: 'fallback' }, 'Fallback content')
  }
}
</script>
```

### Custom Error Components

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :error-component="ErrorComponent"
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('BrokenComponent')

const ErrorComponent = {
  props: ['error', 'retry'],
  render() {
    return h('div', { class: 'error-boundary' }, [
      h('h3', 'Something went wrong'),
      h('p', this.error?.message || 'Unknown error'),
      h('button', { onClick: this.retry }, 'Retry')
    ])
  }
}
</script>
```

## Performance Features

### Caching

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :cache="true"
    :cache-key="cacheKey"
    :cache-ttl="600000"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(() => import('./HeavyComponent.vue'))
const componentId = ref('heavy-1')

const cacheKey = computed(() => `heavy-component-${componentId.value}`)
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
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

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

## TypeScript Support

EwVueComponent is fully written in TypeScript and provides complete type definitions:

```typescript
import { EwVueComponent } from 'ew-vue-component'
import type { ComponentType, Plugin } from 'ew-vue-component'

// Type-safe component usage
const MyComponent: ComponentType = {
  render() {
    return h('div', 'Typed component')
  }
}

// Type-safe plugin
const myPlugin: Plugin = {
  name: 'my-plugin',
  beforeRender(component, props, context) {
    // Fully typed context
    context.utils.log('Rendering component')
  }
}
``` 