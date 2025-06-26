# Basic Usage

## Dynamic Component Switching

The core functionality of EwVueComponent is dynamic component switching. You can pass different types of components through the `is` prop:

### 1. HTML Tag Switching

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToDiv">Div</button>
      <button @click="switchToSpan">Span</button>
      <button @click="switchToButton">Button</button>
    </div>
    
    <EwVueComponent 
      :is="currentTag" 
      :class="tagClass"
      @click="handleClick"
    >
      Current tag: {{ currentTag }}
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentTag = ref('div')
const tagClass = ref('demo-element')

const switchToDiv = () => {
  currentTag.value = 'div'
  tagClass.value = 'demo-element div-style'
}

const switchToSpan = () => {
  currentTag.value = 'span'
  tagClass.value = 'demo-element span-style'
}

const switchToButton = () => {
  currentTag.value = 'button'
  tagClass.value = 'demo-element button-style'
}

const handleClick = () => {
  console.log('Clicked:', currentTag.value)
}
</script>
```

### 2. Vue Component Switching

```vue
<template>
  <div class="demo">
    <button @click="toggleComponent">Toggle Component</button>
    
    <EwVueComponent 
      :is="currentComponent" 
      :title="title"
      :count="count"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref(ComponentA)
const title = ref('Dynamic Title')
const count = ref(0)

const toggleComponent = () => {
  currentComponent.value = currentComponent.value === ComponentA ? ComponentB : ComponentA
}

const handleUpdate = (newCount) => {
  count.value = newCount
}
</script>
```

### 3. Async Component Switching

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadUserProfile">User Profile</button>
      <button @click="loadSettings">Settings</button>
      <button @click="loadDashboard">Dashboard</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <EwVueComponent 
      v-else
      :is="currentAsyncComponent" 
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentAsyncComponent = ref(null)
const loading = ref(false)

const loadUserProfile = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentAsyncComponent.value = () => import('./UserProfile.vue')
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const loadSettings = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    currentAsyncComponent.value = () => import('./Settings.vue')
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const loadDashboard = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    currentAsyncComponent.value = () => import('./Dashboard.vue')
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

## Props Forwarding

EwVueComponent automatically forwards all props (except `is`) to the target component:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :title="title"
    :count="count"
    :disabled="disabled"
    :class="componentClass"
    :style="componentStyle"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('button')
const title = ref('Click me')
const count = ref(0)
const disabled = ref(false)
const componentClass = ref('my-button')
const componentStyle = ref({ color: 'blue' })

const handleClick = () => {
  count.value++
}

const handleInput = (value) => {
  console.log('Input:', value)
}

const handleChange = (value) => {
  console.log('Change:', value)
}
</script>
```

## Slot Support

Supports default slots and named slots, automatically forwarded to the target component:

### 1. Default Slot

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <p>This is the default slot content</p>
    <span>Can contain multiple elements</span>
  </EwVueComponent>
</template>
```

### 2. Named Slots

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #header>
      <h2>Header Content</h2>
      <p>Header description</p>
    </template>
    
    <template #default>
      <p>Default content</p>
      <div>Main content area</div>
    </template>
    
    <template #footer>
      <p>Footer content</p>
      <button>Action button</button>
    </template>
    
    <template #sidebar>
      <nav>Side navigation</nav>
    </template>
  </EwVueComponent>
</template>
```

### 3. Scoped Slots

```vue
<template>
  <EwVueComponent :is="currentComponent">
    <template #default="{ data, index }">
      <div class="item">
        <span>{{ index + 1 }}. {{ data.title }}</span>
        <button @click="handleItemClick(data)">Action</button>
      </div>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('ListItem')

const handleItemClick = (data) => {
  console.log('Clicked item:', data)
}
</script>
```

## Event Handling

EwVueComponent automatically forwards all events to the target component:

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    @click="handleClick"
    @input="handleInput"
    @change="handleChange"
    @submit="handleSubmit"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
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

const handleFocus = (event) => {
  console.log('Focus event:', event)
}

const handleBlur = (event) => {
  console.log('Blur event:', event)
}

const handleKeydown = (event) => {
  console.log('Keydown event:', event.key)
}

const handleMouseEnter = (event) => {
  console.log('Mouse enter event:', event)
}

const handleMouseLeave = (event) => {
  console.log('Mouse leave event:', event)
}
</script>
```

## Reactive Updates

EwVueComponent fully supports Vue 3's reactivity system:

```vue
<template>
  <div class="demo">
    <div class="controls">
      <input v-model="componentName" placeholder="Enter component name" />
      <input v-model="componentProps.title" placeholder="Enter title" />
      <input v-model.number="componentProps.count" type="number" placeholder="Enter count" />
      <label>
        <input v-model="componentProps.disabled" type="checkbox" />
        Disabled state
      </label>
    </div>
    
    <EwVueComponent 
      :is="componentName"
      v-bind="componentProps"
      @click="handleClick"
    >
      <template #default>
        <p>Current component: {{ componentName }}</p>
        <p>Title: {{ componentProps.title }}</p>
        <p>Count: {{ componentProps.count }}</p>
        <p>State: {{ componentProps.disabled ? 'Disabled' : 'Enabled' }}</p>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const componentName = ref('div')
const componentProps = reactive({
  title: 'Dynamic Title',
  count: 0,
  disabled: false
})

const handleClick = () => {
  if (!componentProps.disabled) {
    componentProps.count++
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
  flex-direction: column;
  gap: 0.5rem;
}

.controls input {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
```

## Important Notes

1. **Component Types**: The `is` prop supports strings, component objects, async component functions, and more
2. **Props Forwarding**: All props except `is` are forwarded to the target component
3. **Event Forwarding**: All events are forwarded to the target component
4. **Slot Forwarding**: All slots are forwarded to the target component
5. **Reactivity**: Fully supports Vue 3's reactivity system
6. **Type Safety**: It's recommended to use TypeScript for better type hints

## Next Steps

- Check out [Advanced Features](/en/guide/advanced-features) to learn about async components, error handling, and more
- Browse the [API Documentation](/en/api/) for complete API reference
- See [Best Practices](/en/guide/best-practices) to learn about performance optimization and design patterns 