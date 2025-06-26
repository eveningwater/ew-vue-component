---
layout: home
hero:
  name: EwVueComponent
  text: 强大的 Vue 3 动态组件包装器
  tagline: 轻松实现组件动态切换、错误处理和性能优化
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/
    - theme: alt
      text: 查看示例
      link: /zh-CN/examples/
features:
  - icon: 🚀
    title: 高性能
    details: 基于 Vue 3 Composition API 构建，支持响应式更新和智能缓存
  - icon: 🛡️
    title: 类型安全
    details: 完整的 TypeScript 支持，提供优秀的开发体验和类型提示
  - icon: 🔧
    title: 易于使用
    details: 简洁的 API 设计，几行代码即可实现复杂的动态组件功能
  - icon: 🎯
    title: 错误处理
    details: 内置错误边界和降级处理，确保应用稳定性
  - icon: 📦
    title: 轻量级
    details: 极小的包体积，无额外依赖，不影响应用性能
  - icon: 🌍
    title: 生态友好
    details: 完美兼容 Vue 3 生态系统，支持所有主流构建工具
---

## 为什么选择 EwVueComponent？

EwVueComponent 是一个专为 Vue 3 设计的动态组件包装器，它解决了在复杂应用中动态切换组件的痛点，提供了优雅的解决方案。

### 核心特性

- **动态组件切换**: 支持字符串、组件对象、异步组件的无缝切换
- **智能错误处理**: 内置错误边界，自动降级到备用组件和错误重试
- **性能优化**: 支持组件缓存、性能监控和智能加载
- **类型安全**: 完整的 TypeScript 支持，提供优秀的开发体验
- **插件系统**: 可扩展的插件架构，内置日志、性能和错误处理插件

### 快速体验

```vue
<template>
  <EwVueComponent 
    :is="currentComponent" 
    v-bind="componentProps"
    @error="handleError"
  >
    <template #default>
      <p>默认插槽内容</p>
    </template>
    <template #header>
      <h2>头部插槽</h2>
    </template>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentComponent = ref('div')
const componentProps = ref({ class: 'my-component' })

const handleError = (error) => {
  console.error('组件加载失败:', error)
}
</script>
```

### 开始使用

立即开始使用 EwVueComponent，体验现代化的 Vue 3 开发：

<div class="cta-buttons">
  <a href="/zh-CN/guide/" class="cta-button primary">阅读文档</a>
  <a href="/zh-CN/examples/" class="cta-button secondary">查看示例</a>
  <a href="https://github.com/eveningwater/ew-vue-component" class="cta-button secondary">GitHub</a>
</div>

<style scoped>
.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.cta-button.primary {
  background: var(--vp-c-brand);
  color: white;
}

.cta-button.primary:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.cta-button.secondary {
  background: transparent;
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.cta-button.secondary:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: translateY(-2px);
}
</style> 