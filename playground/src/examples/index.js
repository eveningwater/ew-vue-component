import example1Raw from '../template/examples/example-1.vue?raw';
import example2Raw from '../template/examples/example-2.vue?raw';
import example3Raw from '../template/examples/example-3.vue?raw';

export const examples = [
  {
    id: 'example-1',
    title: '示例1',
    description: '基础组件使用',
    files: [
      {
        name: 'App.vue',
        content: example1Raw
      }
    ]
  },
  {
    id: 'example-2',
    title: '示例2',
    description: '插件系统',
    files: [
      {
        name: 'App.vue',
        content: example2Raw
      }
    ]
  },
  {
    id: 'example-3',
    title: '示例3 - 异步组件渲染',
    description: '演示EwVueComponent的异步组件加载功能，包含用户资料、设置、仪表板三个完整的内联组件示例',
    files: [
      {
        name: 'App.vue',
        content: example3Raw
      }
    ]
  },
  {
    id: 'example-4',
    title: '示例4',
    description: '动态渲染组件',
    files: [
      {
        name: 'App.vue',
        content: `<template>
  <div class="demo-container">
    <h2>基础用法示例</h2>
    <p>使用 EwVueComponent 动态渲染组件：</p>
    
    <div class="example">
      <EwVueComponent :is="currentComponent" />
    </div>
    
    <div class="controls">
      <button 
        v-for="comp in components" 
        :key="comp.name"
        @click="currentComponent = comp"
        :class="{ active: currentComponent === comp }"
      >
        {{ comp.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const HelloComponent = markRaw({
  template: '<div class="hello">Hello World! 🌍</div>'
})

const CounterComponent = markRaw({
  template: \`
    <div class="counter">
      <h3>计数器: {{ count }}</h3>
      <button @click="increment">+1</button>
      <button @click="decrement">-1</button>
    </div>
  \`,
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    const decrement = () => count.value--
    return { count, increment, decrement }
  }
})

const components = [
  markRaw({ name: 'Hello', ...HelloComponent }),
  markRaw({ name: 'Counter', ...CounterComponent })
]

const currentComponent = ref(components[0])
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.example {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: #f0f0f0;
}

.controls button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.hello {
  color: #42b983;
  font-size: 18px;
  font-weight: bold;
}

.counter {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.counter button {
  margin: 0 5px;
  padding: 5px 15px;
  border: none;
  background: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>`
      }
    ]
  },
  {
    id: 'example-5',
    title: '示例5',
    description: '动态切换不同的组件',
    files: [
      {
        name: 'App.vue',
        content: `<template>
  <div class="demo-container">
    <h2>动态组件切换</h2>
    <p>根据用户操作动态切换不同的组件类型：</p>
    
    <div class="component-selector">
      <label>选择组件类型：</label>
      <select v-model="selectedType" @change="updateComponent">
        <option value="form">表单组件</option>
        <option value="chart">图表组件</option>
        <option value="list">列表组件</option>
      </select>
    </div>
    
    <div class="dynamic-area">
      <EwVueComponent 
        :is="dynamicComponent" 
        :key="componentKey"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, markRaw } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const FormComponent = markRaw({
  template: \`
    <form class="form-component" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>姓名：</label>
        <input v-model="formData.name" type="text" placeholder="请输入姓名" />
      </div>
      <div class="form-group">
        <label>邮箱：</label>
        <input v-model="formData.email" type="email" placeholder="请输入邮箱" />
      </div>
      <button type="submit">提交</button>
      <div v-if="submitted" class="success">提交成功！</div>
    </form>
  \`,
  setup() {
    const formData = reactive({ name: '', email: '' })
    const submitted = ref(false)
    
    const handleSubmit = () => {
      submitted.value = true
      setTimeout(() => submitted.value = false, 2000)
    }
    
    return { formData, submitted, handleSubmit }
  }
})

const selectedType = ref('form')
const componentKey = ref(0)

const componentMap = {
  form: FormComponent,
  chart: markRaw({ 
    template: \`
      <div class="chart-demo">
        <h3>📊 图表组件</h3>
        <div class="chart-bars">
          <div v-for="n in 5" :key="n" 
               class="bar" 
               :style="{ height: Math.random() * 100 + 'px' }">
          </div>
        </div>
      </div>
    \`
  }),
  list: markRaw({ 
    template: \`
      <div class="list-demo">
        <h3>📋 列表组件</h3>
        <ul>
          <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
      </div>
    \`,
    setup() {
      const items = ['项目 1', '项目 2', '项目 3', '项目 4']
      return { items }
    }
  })
}

const dynamicComponent = ref(componentMap.form)

const updateComponent = () => {
  dynamicComponent.value = componentMap[selectedType.value]
  componentKey.value++
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.component-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.component-selector select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dynamic-area {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  min-height: 300px;
}

.form-component {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-component button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success {
  margin-top: 10px;
  color: green;
  font-weight: bold;
}

.chart-demo {
  padding: 20px;
  text-align: center;
}

.chart-bars {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: end;
  height: 150px;
}

.bar {
  width: 20px;
  background: #42b983;
}

.list-demo {
  padding: 20px;
}

.list-demo ul {
  list-style: none;
  padding: 0;
}

.list-demo li {
  padding: 8px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>`
      }
    ]
  }
];
