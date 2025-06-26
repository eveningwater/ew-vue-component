# Basic Examples

## Dynamic HTML Tag Switching

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="switchToDiv">Switch to Div</button>
      <button @click="switchToSpan">Switch to Span</button>
      <button @click="switchToButton">Switch to Button</button>
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

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f8fafc;
}

.demo-element {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.div-style {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.span-style {
  background: #fef3c7;
  border-color: #f59e0b;
  display: inline-block;
}

.button-style {
  background: #dcfce7;
  border-color: #22c55e;
  cursor: pointer;
}

.button-style:hover {
  background: #bbf7d0;
}
</style>
```

## Component Object Rendering

```vue
<template>
  <div class="demo">
    <button @click="toggleComponent">Toggle Component</button>
    
    <EwVueComponent :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const isFirstComponent = ref(true)

const firstComponent = {
  render() {
    return h('div', { class: 'component-a' }, [
      h('h3', 'Component A'),
      h('p', 'This is a component created through render function'),
      h('button', { onClick: () => alert('From Component A') }, 'Click me')
    ])
  }
}

const secondComponent = {
  render() {
    return h('div', { class: 'component-b' }, [
      h('h3', 'Component B'),
      h('p', 'This is another component created through render function'),
      h('input', { 
        placeholder: 'Enter some content',
        onInput: (e) => console.log('Input:', e.target.value)
      })
    ])
  }
}

const currentComponent = ref(firstComponent)

const toggleComponent = () => {
  isFirstComponent.value = !isFirstComponent.value
  currentComponent.value = isFirstComponent.value ? firstComponent : secondComponent
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.demo button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.component-a {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #0ea5e9;
}

.component-a h3 {
  color: #0c4a6e;
  margin: 0 0 0.5rem 0;
}

.component-a button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.component-b {
  background: #fef3c7;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid #f59e0b;
}

.component-b h3 {
  color: #92400e;
  margin: 0 0 0.5rem 0;
}

.component-b input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #f59e0b;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}
</style>
```

## Async Component Loading

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadUserProfile">Load User Profile</button>
      <button @click="loadSettings">Load Settings</button>
      <button @click="loadDashboard">Load Dashboard</button>
    </div>
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
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
    // Simulate async loading
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
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f8fafc;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}
</style>
```

## Props and Event Forwarding

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        Component Type:
        <select v-model="componentType">
          <option value="button">Button</option>
          <option value="input">Input</option>
          <option value="textarea">Textarea</option>
        </select>
      </label>
    </div>
    
    <EwVueComponent 
      :is="componentType"
      :value="inputValue"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :class="componentClass"
      @click="handleClick"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      {{ buttonText }}
    </EwVueComponent>
    
    <div class="output">
      <h4>Current Value:</h4>
      <p>{{ inputValue || 'No value' }}</p>
      
      <h4>Events Log:</h4>
      <ul>
        <li v-for="(event, index) in eventLog" :key="index">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const componentType = ref('button')
const inputValue = ref('')
const isDisabled = ref(false)
const eventLog = ref([])

const placeholder = computed(() => {
  switch (componentType.value) {
    case 'input': return 'Enter text here...'
    case 'textarea': return 'Enter multiline text...'
    default: return ''
  }
})

const buttonText = computed(() => 
  componentType.value === 'button' ? 'Click me!' : ''
)

const componentClass = computed(() => `demo-${componentType.value}`)

const addEvent = (eventName, detail = '') => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift(`${timestamp}: ${eventName} ${detail}`)
  if (eventLog.value.length > 5) {
    eventLog.value.pop()
  }
}

const handleClick = (event) => {
  addEvent('clicked')
}

const handleInput = (event) => {
  inputValue.value = event.target.value
  addEvent('input', `"${event.target.value}"`)
}

const handleFocus = (event) => {
  addEvent('focused')
}

const handleBlur = (event) => {
  addEvent('blurred')
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
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
}

.demo-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.demo-button:hover {
  background: #2563eb;
}

.demo-input,
.demo-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.demo-input:focus,
.demo-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.demo-textarea {
  min-height: 100px;
  resize: vertical;
}

.output {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.output h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.output p {
  margin: 0 0 1rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  font-family: monospace;
}

.output ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.output li {
  padding: 0.25rem 0.5rem;
  background: white;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
```

## Slot Forwarding

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        Component:
        <select v-model="currentComponent">
          <option value="CardComponent">Card Component</option>
          <option value="ModalComponent">Modal Component</option>
          <option value="TabsComponent">Tabs Component</option>
        </select>
      </label>
    </div>
    
    <EwVueComponent :is="componentMap[currentComponent]">
      <!-- Default slot -->
      <template #default>
        <p>This is the main content that goes in the default slot.</p>
        <p>It can contain multiple elements and will be passed through to the target component.</p>
      </template>
      
      <!-- Named slots -->
      <template #header>
        <h3>{{ currentComponent }} Header</h3>
        <p>This content appears in the header slot.</p>
      </template>
      
      <template #footer>
        <div class="footer-content">
          <button @click="handleAction">Action Button</button>
          <span>Footer content for {{ currentComponent }}</span>
        </div>
      </template>
      
      <!-- Scoped slot (for components that support it) -->
      <template #item="{ item, index }" v-if="currentComponent === 'TabsComponent'">
        <div class="tab-item">
          <span>{{ index + 1 }}.</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </template>
    </EwVueComponent>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('CardComponent')

// Mock components that demonstrate different slot usage
const CardComponent = {
  name: 'CardComponent',
  render() {
    return h('div', { class: 'card' }, [
      h('div', { class: 'card-header' }, this.$slots.header?.()),
      h('div', { class: 'card-body' }, this.$slots.default?.()),
      h('div', { class: 'card-footer' }, this.$slots.footer?.())
    ])
  }
}

const ModalComponent = {
  name: 'ModalComponent',
  render() {
    return h('div', { class: 'modal' }, [
      h('div', { class: 'modal-header' }, this.$slots.header?.()),
      h('div', { class: 'modal-content' }, this.$slots.default?.()),
      h('div', { class: 'modal-footer' }, this.$slots.footer?.())
    ])
  }
}

const TabsComponent = {
  name: 'TabsComponent',
  data() {
    return {
      items: [
        { title: 'Tab 1', description: 'Content for first tab' },
        { title: 'Tab 2', description: 'Content for second tab' },
        { title: 'Tab 3', description: 'Content for third tab' }
      ]
    }
  },
  render() {
    return h('div', { class: 'tabs' }, [
      h('div', { class: 'tabs-header' }, this.$slots.header?.()),
      h('div', { class: 'tabs-content' }, [
        this.$slots.default?.(),
        h('div', { class: 'tab-items' }, 
          this.items.map((item, index) => 
            this.$slots.item?.({ item, index }) || h('div', `${item.title}: ${item.description}`)
          )
        )
      ]),
      h('div', { class: 'tabs-footer' }, this.$slots.footer?.())
    ])
  }
}

const componentMap = {
  CardComponent,
  ModalComponent,
  TabsComponent
}

const handleAction = () => {
  alert(`Action triggered for ${currentComponent.value}`)
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.controls {
  margin-bottom: 2rem;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
}

/* Card Component Styles */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-header {
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-body {
  padding: 1rem;
}

.card-footer {
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Modal Component Styles */
.modal {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #3b82f6;
  color: white;
}

.modal-content {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

/* Tabs Component Styles */
.tabs {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.tabs-header {
  padding: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.tabs-content {
  padding: 1rem;
}

.tab-items {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tab-item {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #f9fafb;
}

.tab-item span {
  color: #6b7280;
  margin-right: 0.5rem;
}

.tab-item strong {
  color: #374151;
}

.tab-item p {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.tabs-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.footer-content button:hover {
  background: #2563eb;
}
</style>
```

## Performance with Caching

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadHeavyComponent">Load Heavy Component</button>
      <button @click="loadComplexComponent">Load Complex Component</button>
      <button @click="clearCache">Clear Cache</button>
      
      <label>
        <input v-model="enableCache" type="checkbox" />
        Enable Caching
      </label>
    </div>
    
    <div class="info">
      <p>Load time: {{ loadTime }}ms</p>
      <p>Cache status: {{ cacheStatus }}</p>
      <p>Component loads: {{ loadCount }}</p>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :cache="enableCache"
      :cache-key="cacheKey"
      :cache-ttl="cacheTtl"
      :plugins="[performancePlugin]"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const enableCache = ref(true)
const loadTime = ref(0)
const cacheStatus = ref('No component loaded')
const loadCount = ref(0)
const componentType = ref('')

const cacheKey = computed(() => `demo-${componentType.value}`)
const cacheTtl = computed(() => 300000) // 5 minutes

// Mock heavy component that takes time to "load"
const createHeavyComponent = () => ({
  name: 'HeavyComponent',
  render() {
    return h('div', { class: 'heavy-component' }, [
      h('h3', 'Heavy Component'),
      h('p', 'This component simulates a heavy, expensive-to-create component.'),
      h('div', { class: 'content' }, [
        h('p', 'Load count: ' + loadCount.value),
        h('p', 'This component would typically contain complex logic, large datasets, or expensive computations.'),
        ...Array.from({ length: 10 }, (_, i) => 
          h('div', { class: 'item', key: i }, `Heavy item ${i + 1}`)
        )
      ])
    ])
  }
})

const createComplexComponent = () => ({
  name: 'ComplexComponent',
  render() {
    return h('div', { class: 'complex-component' }, [
      h('h3', 'Complex Component'),
      h('p', 'This component simulates complex business logic and rendering.'),
      h('div', { class: 'grid' }, 
        Array.from({ length: 20 }, (_, i) => 
          h('div', { class: 'grid-item', key: i }, [
            h('h4', `Item ${i + 1}`),
            h('p', `Complex calculation result: ${Math.random().toFixed(4)}`),
            h('button', { onClick: () => console.log(`Clicked item ${i + 1}`) }, 'Action')
          ])
        )
      )
    ])
  }
})

const performancePlugin = {
  name: 'performance',
  beforeRender(component, props, context) {
    context.data.startTime = performance.now()
  },
  afterRender(component, props, context) {
    const endTime = performance.now()
    loadTime.value = Math.round(endTime - context.data.startTime)
  }
}

const loadHeavyComponent = async () => {
  const startLoad = performance.now()
  componentType.value = 'heavy'
  
  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    loadCount.value++
    currentComponent.value = createHeavyComponent()
    cacheStatus.value = enableCache.value ? 'Cached' : 'Not cached'
    
  } catch (error) {
    handleError(error)
  }
}

const loadComplexComponent = async () => {
  componentType.value = 'complex'
  
  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    loadCount.value++
    currentComponent.value = createComplexComponent()
    cacheStatus.value = enableCache.value ? 'Cached' : 'Not cached'
    
  } catch (error) {
    handleError(error)
  }
}

const clearCache = () => {
  // This would trigger cache clearing in a real implementation
  cacheStatus.value = 'Cache cleared'
  loadCount.value = 0
}

const handleError = (error) => {
  console.error('Component loading error:', error)
  cacheStatus.value = 'Error occurred'
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
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f8fafc;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.info p {
  margin: 0 0 0.5rem 0;
  font-family: monospace;
}

.heavy-component {
  padding: 1rem;
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 0.5rem;
}

.heavy-component .content {
  margin-top: 1rem;
}

.heavy-component .item {
  padding: 0.5rem;
  margin: 0.25rem 0;
  background: white;
  border-radius: 0.25rem;
}

.complex-component {
  padding: 1rem;
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.grid-item {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.grid-item h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.grid-item p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.grid-item button {
  padding: 0.25rem 0.5rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.grid-item button:hover {
  background: #0284c7;
}
</style>
``` 