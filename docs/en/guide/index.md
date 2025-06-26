# Getting Started

## Installation

Install with npm:

```bash
npm install ew-vue-component
```

Install with yarn:

```bash
yarn add ew-vue-component
```

Install with pnpm:

```bash
pnpm add ew-vue-component
```

## Basic Usage

### 1. Global Registration

```js
import { createApp } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import App from './App.vue'

const app = createApp(App)
app.component('EwVueComponent', EwVueComponent)
app.mount('#app')
```

### 2. Local Registration

```vue
<template>
  <EwVueComponent :is="currentComponent" />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
</script>
```

### 3. Basic Example

```vue
<template>
  <div>
    <button @click="switchComponent">Switch Component</button>
    <EwVueComponent 
      :is="currentComponent" 
      :class="componentClass"
      @error="handleError"
    >
      <template #default>
        <p>This is slot content</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const componentClass = ref('my-component')

const switchComponent = () => {
  currentComponent.value = currentComponent.value === 'div' ? 'span' : 'div'
}

const handleError = (error) => {
  console.error('Component loading failed:', error)
}
</script>
```

## Supported Component Types

EwVueComponent supports multiple component types:

### 1. HTML Tags

```vue
<template>
  <EwVueComponent is="div" class="container">
    <p>This is a div element</p>
  </EwVueComponent>
</template>
```

### 2. Vue Components

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

### 3. Async Components

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

### 4. Component Objects

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

## Props Forwarding

EwVueComponent automatically forwards all props (except `is`):

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    @click="handleClick"
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
</script>
```

## Slot Support

Supports default slots and named slots:

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
    
    <template #footer>
      <p>Footer content</p>
    </template>
  </EwVueComponent>
</template>
```

## Error Handling

When component loading fails, an `error` event is triggered:

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

const currentComponent = ref('NonExistentComponent')

const handleError = (error) => {
  console.error('Component error:', error)
  // You can set a fallback component here
  currentComponent.value = 'div'
}
</script>
```

## Next Steps

- Check out the [API documentation](/en/api/) for complete API reference
- Browse [examples](/en/examples/) to learn more usage patterns
- Learn about [advanced features](/en/guide/advanced-features) and best practices 