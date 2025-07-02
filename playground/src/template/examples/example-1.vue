<template>
    <div class="demo">
        <div class="controls">
            <button @click="switchToDiv">切换到 Div</button>
            <button @click="switchToSpan">切换到 Span</button>
            <button @click="switchToButton">切换到 Button</button>
        </div>

        <EwVueComponent :is="currentTag" :class="tagClass" @click="handleClick">
            当前标签: {{ currentTag }}
        </EwVueComponent>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentTag = ref('div')
const tagClass = ref('demo-element div-style')

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
    console.log('点击了:', currentTag.value)
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