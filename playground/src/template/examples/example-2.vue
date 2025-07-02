<template>
    <div class="demo">
        <button @click="toggleComponent">切换组件</button>
        <EwVueComponent :is="markRaw(currentComponent)" />
    </div>
</template>

<script setup>
import { ref, h, markRaw } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const isFirstComponent = ref(true)

const firstComponent = {
    render() {
        return h('div', { class: 'component-a' }, [
            h('h3', '组件 A'),
            h('p', '这是一个通过 render 函数创建的组件'),
            h('button', { onClick: () => alert('来自组件 A') }, '点击我')
        ])
    }
}

const secondComponent = {
    render() {
        return h('div', { class: 'component-b' }, [
            h('h3', '组件 B'),
            h('p', '这是另一个通过 render 函数创建的组件'),
            h('input', {
                placeholder: '输入一些内容',
                onInput: (e) => console.log('输入:', e.target.value)
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