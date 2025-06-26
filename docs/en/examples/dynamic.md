# Dynamic Examples

## Dynamic Form Builder

```vue
<template>
  <div class="demo">
    <h3>Dynamic Form Builder</h3>
    
    <div class="form-builder">
      <div class="controls">
        <h4>Add Form Fields:</h4>
        <button @click="addField('text')">Text Input</button>
        <button @click="addField('textarea')">Textarea</button>
        <button @click="addField('select')">Select</button>
        <button @click="addField('checkbox')">Checkbox</button>
        <button @click="addField('radio')">Radio Group</button>
      </div>
      
      <div class="form-preview">
        <h4>Form Preview:</h4>
        <form @submit.prevent="handleSubmit" class="dynamic-form">
          <div v-for="field in formFields" :key="field.id" class="field-container">
            <label :for="field.id">{{ field.label }}</label>
            
            <EwVueComponent 
              :is="field.component"
              :id="field.id"
              :value="formData[field.id]"
              v-bind="field.props"
              @input="handleFieldInput(field.id, $event)"
              @change="handleFieldChange(field.id, $event)"
            />
            
            <button type="button" @click="removeField(field.id)" class="remove-field">
              Remove
            </button>
          </div>
          
          <button type="submit" class="submit-button">Submit Form</button>
        </form>
      </div>
      
      <div class="form-data">
        <h4>Form Data:</h4>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const formFields = ref([])
const formData = reactive({})
let fieldIdCounter = 0

const addField = (type) => {
  const fieldId = `field_${++fieldIdCounter}`
  const field = createField(fieldId, type)
  
  formFields.value.push(field)
  formData[fieldId] = field.defaultValue
}

const createField = (id, type) => {
  const fields = {
    text: {
      id,
      label: `Text Field ${id}`,
      component: 'input',
      props: {
        type: 'text',
        placeholder: 'Enter text...',
        class: 'form-input'
      },
      defaultValue: ''
    },
    textarea: {
      id,
      label: `Textarea ${id}`,
      component: 'textarea',
      props: {
        placeholder: 'Enter multiline text...',
        rows: 4,
        class: 'form-textarea'
      },
      defaultValue: ''
    },
    select: {
      id,
      label: `Select ${id}`,
      component: 'select',
      props: {
        class: 'form-select'
      },
      defaultValue: 'option1',
      options: [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' },
        { value: 'option3', text: 'Option 3' }
      ]
    },
    checkbox: {
      id,
      label: `Checkbox ${id}`,
      component: 'input',
      props: {
        type: 'checkbox',
        class: 'form-checkbox'
      },
      defaultValue: false
    },
    radio: {
      id,
      label: `Radio Group ${id}`,
      component: 'RadioGroup',
      props: {
        name: id,
        options: [
          { value: 'radio1', text: 'Radio 1' },
          { value: 'radio2', text: 'Radio 2' },
          { value: 'radio3', text: 'Radio 3' }
        ]
      },
      defaultValue: 'radio1'
    }
  }
  
  return fields[type]
}

const RadioGroup = {
  props: ['name', 'options', 'value'],
  emits: ['input', 'change'],
  render() {
    return h('div', { class: 'radio-group' }, 
      this.options.map(option => 
        h('label', { class: 'radio-label', key: option.value }, [
          h('input', {
            type: 'radio',
            name: this.name,
            value: option.value,
            checked: this.value === option.value,
            onChange: (e) => {
              this.$emit('input', e.target.value)
              this.$emit('change', e.target.value)
            }
          }),
          h('span', option.text)
        ])
      )
    )
  }
}

const removeField = (fieldId) => {
  const index = formFields.value.findIndex(field => field.id === fieldId)
  if (index > -1) {
    formFields.value.splice(index, 1)
    delete formData[fieldId]
  }
}

const handleFieldInput = (fieldId, event) => {
  const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
  formData[fieldId] = value
}

const handleFieldChange = (fieldId, value) => {
  formData[fieldId] = value
}

const handleSubmit = () => {
  console.log('Form submitted:', formData)
  alert('Form submitted! Check console for data.')
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.form-builder {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.controls {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.controls h4 {
  margin: 0 0 1rem 0;
}

.controls button {
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f1f5f9;
}

.form-preview {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.dynamic-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-container {
  position: relative;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.field-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.remove-field {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.submit-button:hover {
  background: #2563eb;
}

.form-data {
  grid-column: 1 / -1;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.form-data pre {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .form-builder {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Dynamic Dashboard

```vue
<template>
  <div class="demo">
    <h3>Dynamic Dashboard</h3>
    
    <div class="dashboard-controls">
      <div class="widget-selector">
        <h4>Add Widgets:</h4>
        <select v-model="selectedWidget">
          <option value="">Select widget type...</option>
          <option value="chart">Chart Widget</option>
          <option value="stats">Stats Widget</option>
          <option value="todo">Todo Widget</option>
          <option value="weather">Weather Widget</option>
          <option value="news">News Widget</option>
        </select>
        <button @click="addWidget" :disabled="!selectedWidget">Add Widget</button>
      </div>
      
      <div class="layout-controls">
        <h4>Layout:</h4>
        <label>
          <input v-model.number="gridColumns" type="range" min="1" max="4" />
          Columns: {{ gridColumns }}
        </label>
      </div>
    </div>
    
    <div class="dashboard" :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }">
      <div 
        v-for="widget in widgets" 
        :key="widget.id" 
        class="widget-container"
        :class="widget.size"
      >
        <div class="widget-header">
          <h4>{{ widget.title }}</h4>
          <div class="widget-controls">
            <button @click="refreshWidget(widget.id)" class="refresh-btn">🔄</button>
            <button @click="removeWidget(widget.id)" class="remove-btn">✕</button>
          </div>
        </div>
        
        <div class="widget-content">
          <EwVueComponent 
            :is="widget.component"
            v-bind="widget.props"
            :key="widget.refreshKey"
            @error="handleWidgetError"
          />
        </div>
      </div>
    </div>
    
    <div v-if="widgets.length === 0" class="empty-dashboard">
      <h4>📊 Empty Dashboard</h4>
      <p>Add some widgets to get started!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const widgets = ref([])
const selectedWidget = ref('')
const gridColumns = ref(3)
let widgetIdCounter = 0

// Widget components
const ChartWidget = {
  props: ['data'],
  render() {
    return h('div', { class: 'chart-widget' }, [
      h('div', { class: 'chart-placeholder' }, [
        h('div', { class: 'chart-bar', style: { height: '60%' } }),
        h('div', { class: 'chart-bar', style: { height: '80%' } }),
        h('div', { class: 'chart-bar', style: { height: '40%' } }),
        h('div', { class: 'chart-bar', style: { height: '90%' } }),
        h('div', { class: 'chart-bar', style: { height: '70%' } })
      ]),
      h('p', 'Sales Performance Chart')
    ])
  }
}

const StatsWidget = {
  props: ['stats'],
  render() {
    const stats = this.stats || [
      { label: 'Total Users', value: '12,345', change: '+5.2%' },
      { label: 'Revenue', value: '$98,765', change: '+12.1%' },
      { label: 'Orders', value: '1,234', change: '-2.3%' }
    ]
    
    return h('div', { class: 'stats-widget' }, 
      stats.map(stat => 
        h('div', { class: 'stat-item', key: stat.label }, [
          h('div', { class: 'stat-value' }, stat.value),
          h('div', { class: 'stat-label' }, stat.label),
          h('div', { 
            class: `stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`
          }, stat.change)
        ])
      )
    )
  }
}

const TodoWidget = {
  data() {
    return {
      todos: [
        { id: 1, text: 'Review Q3 reports', completed: false },
        { id: 2, text: 'Update dashboard', completed: true },
        { id: 3, text: 'Team meeting at 3pm', completed: false },
        { id: 4, text: 'Deploy new features', completed: false }
      ],
      newTodo: ''
    }
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({
          id: Date.now(),
          text: this.newTodo.trim(),
          completed: false
        })
        this.newTodo = ''
      }
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.completed = !todo.completed
    }
  },
  render() {
    return h('div', { class: 'todo-widget' }, [
      h('div', { class: 'todo-input' }, [
        h('input', {
          value: this.newTodo,
          placeholder: 'Add new task...',
          onInput: (e) => this.newTodo = e.target.value,
          onKeydown: (e) => e.key === 'Enter' && this.addTodo()
        }),
        h('button', { onClick: this.addTodo }, '+')
      ]),
      h('div', { class: 'todo-list' },
        this.todos.map(todo =>
          h('div', { 
            class: `todo-item ${todo.completed ? 'completed' : ''}`,
            key: todo.id
          }, [
            h('input', {
              type: 'checkbox',
              checked: todo.completed,
              onChange: () => this.toggleTodo(todo.id)
            }),
            h('span', todo.text)
          ])
        )
      )
    ])
  }
}

const WeatherWidget = {
  render() {
    return h('div', { class: 'weather-widget' }, [
      h('div', { class: 'weather-main' }, [
        h('div', { class: 'weather-icon' }, '☀️'),
        h('div', { class: 'weather-temp' }, '24°C')
      ]),
      h('div', { class: 'weather-info' }, [
        h('div', 'San Francisco'),
        h('div', 'Sunny'),
        h('div', 'Humidity: 65%')
      ])
    ])
  }
}

const NewsWidget = {
  render() {
    const news = [
      { title: 'New Feature Released', time: '2 hours ago' },
      { title: 'Server Maintenance Complete', time: '5 hours ago' },
      { title: 'Q3 Results Published', time: '1 day ago' }
    ]
    
    return h('div', { class: 'news-widget' },
      news.map((item, index) =>
        h('div', { class: 'news-item', key: index }, [
          h('div', { class: 'news-title' }, item.title),
          h('div', { class: 'news-time' }, item.time)
        ])
      )
    )
  }
}

// Widget definitions
const widgetTypes = {
  chart: {
    title: 'Chart Widget',
    component: ChartWidget,
    props: {},
    size: 'large'
  },
  stats: {
    title: 'Statistics',
    component: StatsWidget,
    props: {},
    size: 'medium'
  },
  todo: {
    title: 'Todo List',
    component: TodoWidget,
    props: {},
    size: 'medium'
  },
  weather: {
    title: 'Weather',
    component: WeatherWidget,
    props: {},
    size: 'small'
  },
  news: {
    title: 'Latest News',
    component: NewsWidget,
    props: {},
    size: 'medium'
  }
}

const addWidget = () => {
  if (!selectedWidget.value) return
  
  const widgetType = widgetTypes[selectedWidget.value]
  const widget = {
    id: ++widgetIdCounter,
    type: selectedWidget.value,
    title: widgetType.title,
    component: widgetType.component,
    props: { ...widgetType.props },
    size: widgetType.size,
    refreshKey: 0
  }
  
  widgets.value.push(widget)
  selectedWidget.value = ''
}

const removeWidget = (widgetId) => {
  const index = widgets.value.findIndex(w => w.id === widgetId)
  if (index > -1) {
    widgets.value.splice(index, 1)
  }
}

const refreshWidget = (widgetId) => {
  const widget = widgets.value.find(w => w.id === widgetId)
  if (widget) {
    widget.refreshKey++
  }
}

const handleWidgetError = (error) => {
  console.error('Widget error:', error)
  // Could show a toast notification or replace with error widget
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.dashboard-controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.widget-selector,
.layout-controls {
  flex: 1;
}

.widget-selector h4,
.layout-controls h4 {
  margin: 0 0 1rem 0;
}

.widget-selector select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.widget-selector button {
  width: 100%;
  padding: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.widget-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.layout-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.widget-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.widget-container.small {
  grid-column: span 1;
}

.widget-container.medium {
  grid-column: span 1;
}

.widget-container.large {
  grid-column: span 2;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.widget-header h4 {
  margin: 0;
  color: #374151;
}

.widget-controls {
  display: flex;
  gap: 0.5rem;
}

.refresh-btn,
.remove-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.refresh-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.remove-btn {
  background: #fecaca;
  color: #dc2626;
}

.widget-content {
  padding: 1rem;
}

.empty-dashboard {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

/* Widget-specific styles */
.chart-widget {
  text-align: center;
}

.chart-placeholder {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 100px;
  margin-bottom: 1rem;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 2px 2px 0 0;
}

.stats-widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.negative {
  color: #dc2626;
}

.todo-widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.todo-input {
  display: flex;
  gap: 0.5rem;
}

.todo-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.todo-input button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed span {
  text-decoration: line-through;
}

.weather-widget {
  text-align: center;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-icon {
  font-size: 2rem;
}

.weather-temp {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.news-widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.25rem;
  border-left: 3px solid #3b82f6;
}

.news-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.news-time {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
  }
  
  .dashboard {
    grid-template-columns: 1fr !important;
  }
  
  .widget-container.large,
  .widget-container.medium,
  .widget-container.small {
    grid-column: span 1;
  }
}
</style>
```

## Dynamic Content Router

```vue
<template>
  <div class="demo">
    <h3>Dynamic Content Router</h3>
    
    <div class="router-demo">
      <nav class="navigation">
        <button 
          v-for="route in routes" 
          :key="route.path"
          @click="navigateTo(route.path)"
          :class="{ active: currentRoute === route.path }"
        >
          {{ route.name }}
        </button>
      </nav>
      
      <div class="route-info">
        <p><strong>Current Route:</strong> {{ currentRoute }}</p>
        <p><strong>Loading:</strong> {{ isLoading ? 'Yes' : 'No' }}</p>
        <p><strong>Error:</strong> {{ routeError || 'None' }}</p>
      </div>
      
      <div class="content-area">
        <div v-if="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading {{ currentRouteName }}...</p>
        </div>
        
        <EwVueComponent 
          v-else
          :is="currentComponent"
          :cache="enableRouteCache"
          :cache-key="currentRoute"
          @error="handleRouteError"
        />
      </div>
      
      <div class="router-controls">
        <label>
          <input v-model="enableRouteCache" type="checkbox" />
          Enable Route Caching
        </label>
        
        <button @click="refreshCurrentRoute">Refresh Current Route</button>
        <button @click="goBack">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentRoute = ref('/home')
const isLoading = ref(false)
const routeError = ref('')
const enableRouteCache = ref(true)
const routeHistory = ref(['/home'])

// Route components
const HomeComponent = {
  render() {
    return h('div', { class: 'home-page' }, [
      h('h2', '🏠 Home Page'),
      h('p', 'Welcome to the dynamic content router demo!'),
      h('div', { class: 'feature-grid' }, [
        h('div', { class: 'feature-card' }, [
          h('h4', 'Dynamic Loading'),
          h('p', 'Components are loaded dynamically based on routes')
        ]),
        h('div', { class: 'feature-card' }, [
          h('h4', 'Caching'),
          h('p', 'Routes can be cached for better performance')
        ]),
        h('div', { class: 'feature-card' }, [
          h('h4', 'Error Handling'),
          h('p', 'Graceful error handling for failed routes')
        ])
      ])
    ])
  }
}

const AboutComponent = {
  render() {
    return h('div', { class: 'about-page' }, [
      h('h2', 'ℹ️ About Page'),
      h('p', 'This is a demonstration of dynamic component routing.'),
      h('div', { class: 'info-section' }, [
        h('h4', 'Features:'),
        h('ul', [
          h('li', 'Dynamic component loading'),
          h('li', 'Route-based caching'),
          h('li', 'Loading states'),
          h('li', 'Error boundaries'),
          h('li', 'Navigation history')
        ])
      ])
    ])
  }
}

const ProductsComponent = {
  data() {
    return {
      products: [
        { id: 1, name: 'Product A', price: '$29.99' },
        { id: 2, name: 'Product B', price: '$39.99' },
        { id: 3, name: 'Product C', price: '$49.99' }
      ]
    }
  },
  render() {
    return h('div', { class: 'products-page' }, [
      h('h2', '🛍️ Products Page'),
      h('p', 'Browse our dynamic product catalog:'),
      h('div', { class: 'products-grid' },
        this.products.map(product =>
          h('div', { class: 'product-card', key: product.id }, [
            h('h4', product.name),
            h('p', { class: 'price' }, product.price),
            h('button', 'Add to Cart')
          ])
        )
      )
    ])
  }
}

const ContactComponent = {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.form)
      alert('Thank you for your message!')
    }
  },
  render() {
    return h('div', { class: 'contact-page' }, [
      h('h2', '📧 Contact Page'),
      h('p', 'Get in touch with us:'),
      h('form', { onSubmit: (e) => { e.preventDefault(); this.submitForm() } }, [
        h('div', { class: 'form-group' }, [
          h('label', 'Name:'),
          h('input', {
            value: this.form.name,
            onInput: (e) => this.form.name = e.target.value,
            required: true
          })
        ]),
        h('div', { class: 'form-group' }, [
          h('label', 'Email:'),
          h('input', {
            type: 'email',
            value: this.form.email,
            onInput: (e) => this.form.email = e.target.value,
            required: true
          })
        ]),
        h('div', { class: 'form-group' }, [
          h('label', 'Message:'),
          h('textarea', {
            value: this.form.message,
            onInput: (e) => this.form.message = e.target.value,
            rows: 4,
            required: true
          })
        ]),
        h('button', { type: 'submit' }, 'Send Message')
      ])
    ])
  }
}

// Simulate async component that sometimes fails
const DashboardComponent = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 30% chance of failure
  if (Math.random() < 0.3) {
    throw new Error('Dashboard failed to load')
  }
  
  return {
    render() {
      return h('div', { class: 'dashboard-page' }, [
        h('h2', '📊 Dashboard'),
        h('p', 'Welcome to your dashboard!'),
        h('div', { class: 'dashboard-widgets' }, [
          h('div', { class: 'widget' }, [
            h('h4', 'Total Sales'),
            h('div', { class: 'stat' }, '$12,345')
          ]),
          h('div', { class: 'widget' }, [
            h('h4', 'New Customers'),
            h('div', { class: 'stat' }, '89')
          ]),
          h('div', { class: 'widget' }, [
            h('h4', 'Orders'),
            h('div', { class: 'stat' }, '156')
          ])
        ])
      ])
    }
  }
}

// Route configuration
const routes = [
  { path: '/home', name: 'Home', component: HomeComponent },
  { path: '/about', name: 'About', component: AboutComponent },
  { path: '/products', name: 'Products', component: ProductsComponent },
  { path: '/contact', name: 'Contact', component: ContactComponent },
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent }
]

const currentComponent = ref(HomeComponent)

const currentRouteName = computed(() => {
  const route = routes.find(r => r.path === currentRoute.value)
  return route ? route.name : 'Unknown'
})

const navigateTo = async (path) => {
  if (path === currentRoute.value) return
  
  const route = routes.find(r => r.path === path)
  if (!route) return
  
  isLoading.value = true
  routeError.value = ''
  
  // Add to history
  if (routeHistory.value[routeHistory.value.length - 1] !== currentRoute.value) {
    routeHistory.value.push(currentRoute.value)
  }
  
  try {
    currentRoute.value = path
    
    if (typeof route.component === 'function') {
      // Async component
      currentComponent.value = await route.component()
    } else {
      // Sync component
      currentComponent.value = route.component
    }
  } catch (error) {
    routeError.value = error.message
    console.error('Route loading error:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshCurrentRoute = () => {
  const path = currentRoute.value
  currentRoute.value = ''
  setTimeout(() => navigateTo(path), 100)
}

const goBack = () => {
  if (routeHistory.value.length > 0) {
    const previousRoute = routeHistory.value.pop()
    navigateTo(previousRoute)
  }
}

const handleRouteError = (error) => {
  routeError.value = error.message
  console.error('Component error:', error)
  
  // Fallback to home
  setTimeout(() => {
    navigateTo('/home')
  }, 3000)
}
</script>

<style scoped>
.demo {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.router-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navigation {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  flex-wrap: wrap;
}

.navigation button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.navigation button:hover {
  background: #f1f5f9;
}

.navigation button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.route-info {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.route-info p {
  margin: 0.25rem 0;
}

.content-area {
  min-height: 300px;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.router-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  flex-wrap: wrap;
}

.router-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.router-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

/* Page-specific styles */
.home-page,
.about-page,
.products-page,
.contact-page,
.dashboard-page {
  max-width: 800px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
}

.feature-card h4 {
  margin: 0 0 0.5rem 0;
  color: #0c4a6e;
}

.info-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.product-card {
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 0.5rem;
  text-align: center;
}

.product-card h4 {
  margin: 0 0 0.5rem 0;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #92400e;
  margin: 0.5rem 0;
}

.product-card button {
  padding: 0.5rem 1rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.contact-page form {
  max-width: 500px;
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.contact-page button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.dashboard-widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.widget {
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 0.5rem;
  text-align: center;
}

.widget h4 {
  margin: 0 0 0.5rem 0;
  color: #064e3b;
}

.stat {
  font-size: 2rem;
  font-weight: bold;
  color: #059669;
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
  }
  
  .router-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .feature-grid,
  .products-grid,
  .dashboard-widgets {
    grid-template-columns: 1fr;
  }
}
</style>
```

This comprehensive set of dynamic examples demonstrates various real-world scenarios where dynamic components shine, including form builders, dashboards, and content routing systems. These examples show how to handle complex state management, user interactions, and dynamic content creation with EwVueComponent. 