<template>
    <div class="demo-container">
        <h2>基础用法示例</h2>
        <p>使用 EwVueComponent 动态渲染组件：</p>
        <div class="example">
            <EwVueComponent :is="currentComponent" />
        </div>

        <div class="controls">
            <button v-for="comp in components" :key="comp.name" @click="currentComponent = comp"
                :class="{ active: currentComponent === comp }">
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
    template: `
      <div class="counter">
        <h3>计数器: {{ count }}</h3>
        <button @click="increment">+1</button>
        <button @click="decrement">-1</button>
      </div>
    `,
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
</style>