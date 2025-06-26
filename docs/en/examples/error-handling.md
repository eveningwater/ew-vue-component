# Error Handling Examples

## Basic Error Handling

### 1. Listening to Error Events

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadValidComponent">Load Valid Component</button>
      <button @click="loadInvalidComponent">Load Invalid Component</button>
      <button @click="loadAsyncErrorComponent">Load Async Error Component</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      @error="handleError"
    />
    
    <div v-if="errorInfo" class="error-info">
      <h4>Error Information:</h4>
      <p><strong>Message:</strong> {{ errorInfo.message }}</p>
      <p><strong>Type:</strong> {{ errorInfo.type }}</p>
      <p><strong>Time:</strong> {{ errorInfo.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const errorInfo = ref(null)

const loadValidComponent = () => {
  currentComponent.value = 'div'
  errorInfo.value = null
}

const loadInvalidComponent = () => {
  currentComponent.value = 'NonExistentComponent'
  errorInfo.value = null
}

const loadAsyncErrorComponent = () => {
  currentComponent.value = () => Promise.reject(new Error('Async component loading failed'))
  errorInfo.value = null
}

const handleError = (error) => {
  console.error('Component error:', error)
  
  errorInfo.value = {
    message: error.message,
    type: error.name || 'UnknownError',
    timestamp: new Date().toLocaleString()
  }
  
  // You can send error logs to server here
  // sendErrorToServer(error)
}
</script>

<style scoped>
.error-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.error-info h4 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
}

.error-info p {
  margin: 0.25rem 0;
}
</style>
```

### 2. Using Fallback Components

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadComponent('UserProfile')">User Profile</button>
      <button @click="loadComponent('Settings')">Settings</button>
      <button @click="loadComponent('BrokenComponent')">Broken Component</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :fallback="fallbackComponent"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')

// Custom fallback component
const fallbackComponent = {
  name: 'FallbackComponent',
  render() {
    return h('div', { class: 'fallback-component' }, [
      h('h3', 'Fallback Component'),
      h('p', 'Original component failed to load, showing fallback content'),
      h('button', {
        onClick: () => this.$emit('retry')
      }, 'Retry Loading')
    ])
  }
}

const componentMap = {
  UserProfile: {
    name: 'UserProfile',
    template: `
      <div class="user-profile">
        <h3>User Profile</h3>
        <p>Username: John Doe</p>
        <p>Email: john.doe@example.com</p>
      </div>
    `
  },
  Settings: {
    name: 'Settings',
    template: `
      <div class="settings">
        <h3>Settings</h3>
        <p>Theme: Dark</p>
        <p>Language: English</p>
      </div>
    `
  }
}

const loadComponent = (name) => {
  currentComponent.value = componentMap[name] || 'BrokenComponent'
}

const handleError = (error) => {
  console.error('Component error, using fallback:', error)
}
</script>

<style scoped>
.fallback-component {
  padding: 2rem;
  text-align: center;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  color: #92400e;
}

.fallback-component button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.user-profile, .settings {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.user-profile {
  background: #f0f9ff;
  border-color: #0ea5e9;
}

.settings {
  background: #dcfce7;
  border-color: #22c55e;
}
</style>
```

## Advanced Error Handling

### 1. Custom Error Components

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="loadWorkingComponent">Load Working Component</button>
      <button @click="loadBrokenComponent">Load Broken Component</button>
      <button @click="loadAsyncFailure">Load Async Failure</button>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :error-component="ErrorComponent"
      @error="handleError"
    />
    
    <div v-if="errorDetails" class="error-details">
      <h4>Error Details (For Debugging):</h4>
      <pre>{{ errorDetails }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const errorDetails = ref(null)

const ErrorComponent = {
  props: ['error', 'retry'],
  data() {
    return {
      isRetrying: false
    }
  },
  methods: {
    async handleRetry() {
      this.isRetrying = true
      try {
        if (this.retry) {
          await this.retry()
        }
      } finally {
        setTimeout(() => {
          this.isRetrying = false
        }, 1000)
      }
    },
    
    reportError() {
      // Simulate error reporting
      console.log('Error reported to support team')
      alert('Error reported! Support team has been notified.')
    }
  },
  render() {
    return h('div', { class: 'error-component' }, [
      h('div', { class: 'error-header' }, [
        h('h3', '⚠️ Something went wrong'),
        h('p', 'We encountered an unexpected error while loading this component.')
      ]),
      
      h('div', { class: 'error-body' }, [
        h('div', { class: 'error-message' }, [
          h('strong', 'Error: '),
          h('span', this.error?.message || 'Unknown error occurred')
        ]),
        
        h('div', { class: 'error-actions' }, [
          h('button', {
            class: 'retry-button',
            disabled: this.isRetrying,
            onClick: this.handleRetry
          }, this.isRetrying ? 'Retrying...' : 'Try Again'),
          
          h('button', {
            class: 'report-button',
            onClick: this.reportError
          }, 'Report Issue'),
          
          h('button', {
            class: 'back-button',
            onClick: () => window.history.back()
          }, 'Go Back')
        ])
      ]),
      
      process.env.NODE_ENV === 'development' && h('details', { class: 'error-stack' }, [
        h('summary', 'Stack Trace (Development Only)'),
        h('pre', this.error?.stack || 'No stack trace available')
      ])
    ])
  }
}

const WorkingComponent = {
  render() {
    return h('div', { class: 'working-component' }, [
      h('h3', '✅ Working Component'),
      h('p', 'This component loaded successfully!'),
      h('p', 'All systems are functioning normally.')
    ])
  }
}

const loadWorkingComponent = () => {
  currentComponent.value = WorkingComponent
  errorDetails.value = null
}

const loadBrokenComponent = () => {
  // Simulate a component that throws an error during render
  currentComponent.value = {
    render() {
      throw new Error('Simulated render error - component is broken!')
    }
  }
  errorDetails.value = null
}

const loadAsyncFailure = () => {
  currentComponent.value = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    throw new Error('Async component failed to load')
  }
  errorDetails.value = null
}

const handleError = (error) => {
  console.error('Component error:', error)
  errorDetails.value = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  }
  
  // Send to error monitoring service
  sendToErrorService(error)
}

const sendToErrorService = (error) => {
  // Simulate sending to error monitoring service
  console.log('Sending to error monitoring service:', {
    error: error.message,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })
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
  display: flex;
  gap: 0.5rem;
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

.error-component {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border: 2px solid #f87171;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(248, 113, 113, 0.1);
  overflow: hidden;
}

.error-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-bottom: 1px solid #f87171;
}

.error-header h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1.25rem;
}

.error-header p {
  margin: 0;
  color: #7f1d1d;
}

.error-body {
  padding: 1.5rem;
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #dc2626;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.error-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.retry-button {
  background: #dc2626;
  color: white;
}

.retry-button:hover:not(:disabled) {
  background: #b91c1c;
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.report-button {
  background: #f59e0b;
  color: white;
}

.report-button:hover {
  background: #d97706;
}

.back-button {
  background: #6b7280;
  color: white;
}

.back-button:hover {
  background: #4b5563;
}

.error-stack {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.error-stack summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-stack pre {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  overflow-x: auto;
}

.working-component {
  padding: 2rem;
  text-align: center;
  background: #f0fdf4;
  border: 2px solid #22c55e;
  border-radius: 0.75rem;
  color: #15803d;
}

.working-component h3 {
  margin: 0 0 1rem 0;
  color: #15803d;
}

.working-component p {
  margin: 0.5rem 0;
}

.error-details {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.error-details h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.error-details pre {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  overflow-x: auto;
}
</style>
```

### 2. Error Boundaries with Recovery

```vue
<template>
  <div class="demo">
    <div class="controls">
      <label>
        <input v-model="enableRetry" type="checkbox" />
        Enable Auto Retry
      </label>
      
      <label>
        Max Retries:
        <input v-model.number="maxRetries" type="number" min="1" max="5" />
      </label>
      
      <button @click="loadRandomComponent">Load Random Component</button>
      <button @click="resetComponent">Reset</button>
    </div>
    
    <div class="status">
      <p>Component: {{ componentStatus }}</p>
      <p>Retry Count: {{ retryCount }} / {{ maxRetries }}</p>
      <p>Last Error: {{ lastError || 'None' }}</p>
    </div>
    
    <ErrorBoundary
      :max-retries="maxRetries"
      :enable-retry="enableRetry"
      @error="handleBoundaryError"
      @retry="handleRetry"
      @max-retries-exceeded="handleMaxRetriesExceeded"
    >
      <EwVueComponent 
        :is="currentComponent"
        :key="componentKey"
        @error="handleComponentError"
      />
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref(null)
const componentKey = ref(0)
const componentStatus = ref('None')
const retryCount = ref(0)
const lastError = ref('')
const enableRetry = ref(true)
const maxRetries = ref(3)

// Error Boundary Component
const ErrorBoundary = {
  props: {
    maxRetries: { type: Number, default: 3 },
    enableRetry: { type: Boolean, default: true }
  },
  emits: ['error', 'retry', 'max-retries-exceeded'],
  data() {
    return {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    }
  },
  methods: {
    async retry() {
      if (this.retryCount >= this.maxRetries) {
        this.$emit('max-retries-exceeded', this.error)
        return
      }
      
      this.isRetrying = true
      this.retryCount++
      this.$emit('retry', this.retryCount)
      
      // Reset error state
      this.hasError = false
      this.error = null
      
      // Force re-render
      await this.$nextTick()
      
      setTimeout(() => {
        this.isRetrying = false
      }, 1000)
    },
    
    reset() {
      this.hasError = false
      this.error = null
      this.retryCount = 0
      this.isRetrying = false
    }
  },
  errorCaptured(error, instance, errorInfo) {
    this.hasError = true
    this.error = error
    this.$emit('error', error, errorInfo)
    
    // Auto retry if enabled
    if (this.enableRetry && this.retryCount < this.maxRetries) {
      setTimeout(() => {
        this.retry()
      }, 2000) // Wait 2 seconds before retry
    }
    
    return false // Prevent error from propagating
  },
  render() {
    if (this.hasError) {
      return h('div', { class: 'error-boundary' }, [
        h('h3', '🚫 Error Boundary Activated'),
        h('p', `Error: ${this.error?.message || 'Unknown error'}`),
        h('p', `Retry attempt: ${this.retryCount} / ${this.maxRetries}`),
        
        this.isRetrying && h('div', { class: 'retrying' }, [
          h('div', { class: 'spinner' }),
          h('span', 'Retrying...')
        ]),
        
        !this.isRetrying && this.retryCount < this.maxRetries && h('div', { class: 'actions' }, [
          h('button', { onClick: this.retry }, 'Manual Retry'),
          h('button', { onClick: this.reset }, 'Reset')
        ]),
        
        this.retryCount >= this.maxRetries && h('div', { class: 'max-retries' }, [
          h('p', '⚠️ Maximum retries exceeded'),
          h('button', { onClick: this.reset }, 'Reset and Try Again')
        ])
      ])
    }
    
    return this.$slots.default?.()
  }
}

// Test components with different failure rates
const components = [
  {
    name: 'ReliableComponent',
    failureRate: 0, // Never fails
    component: {
      render: () => h('div', { class: 'reliable' }, [
        h('h3', '✅ Reliable Component'),
        h('p', 'This component always works!')
      ])
    }
  },
  {
    name: 'SometimesFailsComponent',
    failureRate: 0.3, // 30% failure rate
    component: {
      render() {
        if (Math.random() < 0.3) {
          throw new Error('Random component failure (30% chance)')
        }
        return h('div', { class: 'sometimes-fails' }, [
          h('h3', '⚡ Sometimes Fails Component'),
          h('p', 'This component has a 30% chance of failing'),
          h('p', 'But this time it worked!')
        ])
      }
    }
  },
  {
    name: 'UnreliableComponent',
    failureRate: 0.8, // 80% failure rate
    component: {
      render() {
        if (Math.random() < 0.8) {
          throw new Error('Unreliable component failure (80% chance)')
        }
        return h('div', { class: 'unreliable' }, [
          h('h3', '💥 Unreliable Component'),
          h('p', 'This component has an 80% chance of failing'),
          h('p', 'You got lucky this time!')
        ])
      }
    }
  }
]

const loadRandomComponent = () => {
  const randomComponent = components[Math.floor(Math.random() * components.length)]
  currentComponent.value = randomComponent.component
  componentStatus.value = randomComponent.name
  componentKey.value++ // Force re-render
  
  // Reset error boundary
  retryCount.value = 0
  lastError.value = ''
}

const resetComponent = () => {
  currentComponent.value = null
  componentStatus.value = 'None'
  componentKey.value++
  retryCount.value = 0
  lastError.value = ''
}

const handleBoundaryError = (error, errorInfo) => {
  console.error('Error Boundary caught error:', error)
  lastError.value = error.message
}

const handleRetry = (attempt) => {
  retryCount.value = attempt
  console.log(`Retry attempt ${attempt}`)
}

const handleMaxRetriesExceeded = (error) => {
  console.error('Max retries exceeded:', error)
  lastError.value = `Max retries exceeded: ${error.message}`
}

const handleComponentError = (error) => {
  console.error('Component error:', error)
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

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls input[type="number"] {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
}

.status {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.status p {
  margin: 0.25rem 0;
  font-family: monospace;
}

.error-boundary {
  padding: 2rem;
  text-align: center;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 0.75rem;
  color: #dc2626;
}

.error-boundary h3 {
  margin: 0 0 1rem 0;
}

.retrying {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.actions button:first-child {
  background: #dc2626;
  color: white;
}

.actions button:last-child {
  background: #6b7280;
  color: white;
}

.max-retries {
  margin-top: 1rem;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 0.5rem;
}

.max-retries button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.reliable {
  padding: 1.5rem;
  background: #f0fdf4;
  border: 2px solid #22c55e;
  border-radius: 0.5rem;
  color: #15803d;
  text-align: center;
}

.sometimes-fails {
  padding: 1.5rem;
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 0.5rem;
  color: #92400e;
  text-align: center;
}

.unreliable {
  padding: 1.5rem;
  background: #fef2f2;
  border: 2px solid #f87171;
  border-radius: 0.5rem;
  color: #dc2626;
  text-align: center;
}
</style>
```

### 3. Production Error Monitoring

```vue
<template>
  <div class="demo">
    <div class="controls">
      <button @click="triggerError">Trigger Error</button>
      <button @click="triggerAsyncError">Trigger Async Error</button>
      <button @click="viewErrorLog">View Error Log</button>
      <button @click="clearErrorLog">Clear Log</button>
    </div>
    
    <div v-if="showErrorLog" class="error-log">
      <h4>Error Log ({{ errorLog.length }} errors)</h4>
      <div v-if="errorLog.length === 0" class="no-errors">
        No errors recorded
      </div>
      <div v-else class="error-entries">
        <div v-for="(entry, index) in errorLog" :key="index" class="error-entry">
          <div class="error-header">
            <strong>{{ entry.timestamp }}</strong>
            <span class="error-type">{{ entry.type }}</span>
          </div>
          <div class="error-message">{{ entry.message }}</div>
          <div class="error-meta">
            <span>Component: {{ entry.component }}</span>
            <span>User ID: {{ entry.userId }}</span>
            <span>Session: {{ entry.sessionId }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <EwVueComponent 
      :is="currentComponent"
      :plugins="[errorMonitoringPlugin]"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const errorLog = ref([])
const showErrorLog = ref(false)

// Simulate user and session data
const userData = {
  userId: 'user-123',
  sessionId: 'session-abc',
  buildVersion: '1.2.3'
}

// Error monitoring plugin
const errorMonitoringPlugin = {
  name: 'error-monitoring',
  
  onError(error, context) {
    const errorEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      type: error.name || 'Error',
      message: error.message,
      stack: error.stack,
      component: context.component?.name || 'Unknown',
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: userData.userId,
      sessionId: userData.sessionId,
      buildVersion: userData.buildVersion
    }
    
    // Add to local log
    errorLog.value.unshift(errorEntry)
    
    // Keep only last 50 errors
    if (errorLog.value.length > 50) {
      errorLog.value = errorLog.value.slice(0, 50)
    }
    
    // Send to monitoring service
    this.sendToMonitoringService(errorEntry)
    
    // Show user notification for critical errors
    if (this.isCriticalError(error)) {
      this.showUserNotification(error)
    }
  },
  
  sendToMonitoringService(errorEntry) {
    // Simulate sending to error monitoring service
    console.group('📊 Error Monitoring Service')
    console.log('Sending error report:', errorEntry)
    console.log('Dashboard URL: https://monitoring.example.com/errors/' + errorEntry.id)
    console.groupEnd()
    
    // In a real application, you would send this to your monitoring service:
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorEntry)
    // })
  },
  
  isCriticalError(error) {
    const criticalKeywords = ['network', 'server', 'auth', 'permission']
    const message = error.message.toLowerCase()
    return criticalKeywords.some(keyword => message.includes(keyword))
  },
  
  showUserNotification(error) {
    // Simulate user notification
    console.warn('🚨 Critical error notification shown to user')
    
    // In a real application, you might show a toast notification:
    // toast.error('A critical error occurred. Support has been notified.')
  }
}

const ErrorComponent = {
  render() {
    throw new Error('Intentional error for testing monitoring')
  }
}

const AsyncErrorComponent = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  throw new Error('Async component loading error for testing')
}

const triggerError = () => {
  currentComponent.value = ErrorComponent
}

const triggerAsyncError = () => {
  currentComponent.value = AsyncErrorComponent
}

const viewErrorLog = () => {
  showErrorLog.value = !showErrorLog.value
}

const clearErrorLog = () => {
  errorLog.value = []
  console.log('Error log cleared')
}

const handleError = (error) => {
  console.error('Component error handled:', error)
  
  // Reset to safe component
  setTimeout(() => {
    currentComponent.value = {
      render() {
        return h('div', { class: 'safe-component' }, [
          h('h3', '✅ Safe Component'),
          h('p', 'Error occurred, but application recovered'),
          h('p', 'Error has been logged and reported')
        ])
      }
    }
  }, 2000)
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

.error-log {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.error-log h4 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.no-errors {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.error-entries {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-entry {
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  border-left: 4px solid #dc2626;
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.error-type {
  padding: 0.25rem 0.5rem;
  background: #fecaca;
  color: #dc2626;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.error-message {
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.error-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  flex-wrap: wrap;
}

.safe-component {
  padding: 1.5rem;
  background: #f0fdf4;
  border: 2px solid #22c55e;
  border-radius: 0.5rem;
  color: #15803d;
  text-align: center;
}

.safe-component h3 {
  margin: 0 0 0.5rem 0;
}

.safe-component p {
  margin: 0.25rem 0;
}
</style>
```

This comprehensive error handling guide demonstrates various strategies for handling component errors gracefully, from basic error catching to advanced production monitoring systems. These patterns help ensure your application remains stable and provides good user experience even when components fail. 