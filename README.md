# EwVueComponent

一个强大而灵活的 Vue 3 组件包装器，支持安全的动态组件渲染、全面的错误处理、性能优化和插件系统。

[English](./README.en.md) | 简体中文

## 🎮 在线演练场

体验 EwVueComponent 的强大功能：

- 🌐 [在线演练场](https://eveningwater.github.io/ew-vue-component/) - 实时编写和测试代码
- 📚 [详细文档](https://eveningwater.github.io/ew-vue-component/docs/) - 完整的 API 文档和使用指南

[![npm version](https://badge.fury.io/js/ew-vue-component.svg)](https://badge.fury.io/js/ew-vue-component)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 主要特性

- **🔄 动态组件渲染**: 无缝渲染字符串、Vue 组件、异步组件和组件对象
- **🛡️ 错误边界**: 内置错误处理，自动回退到默认插槽
- **⚡ 性能优化**: 组件缓存、懒加载和性能监控
- **🔌 插件系统**: 可扩展架构，内置日志、性能和错误处理插件
- **📦 TypeScript 支持**: 完整的 TypeScript 支持和类型定义
- **🎯 插槽转发**: 完整的插槽转发，包括具名插槽和作用域插槽
- **🔧 属性/事件转发**: 自动转发所有属性和事件到目标组件
- **🌍 智能环境检测**: 类似 Vue 框架的开发环境检测，构建时优化
- **🚫 零依赖**: 轻量级，无外部依赖

## 📦 安装

```bash
# npm
npm install ew-vue-component

# yarn
yarn add ew-vue-component

# pnpm
pnpm add ew-vue-component
```

### 💅 样式导入

为了获得最佳的视觉体验，请在项目中导入组件的样式文件：

```javascript
// 在 main.js 或 main.ts 中导入
import 'ew-vue-component/dist/ew-vue-component.css';
```

或者在 CSS 文件中导入：

```css
@import 'ew-vue-component/dist/ew-vue-component.css';
```

该样式包含以下默认元素的美观样式：

- **加载状态** (`.ew-vue-component-loading`): 带有动画效果的现代加载界面
- **回退组件** (`.ew-vue-component-fallback`): 优雅的错误回退显示
- **错误状态** (`.ew-vue-component-error`): 错误状态的可视化界面
- **重试按钮** (`.retry-btn`): 具有悬停效果的交互按钮

样式特性：
- 🎨 现代化设计语言，支持渐变和阴影效果
- 🌓 自动深色模式适配 (`prefers-color-scheme: dark`)
- ♿ 高对比度模式支持 (`prefers-contrast: high`)
- 📱 响应式设计，移动设备友好
- ⚡ 尊重用户的动画偏好 (`prefers-reduced-motion`)

## 🌍 环境自动切换

和 Vue 一样，EwVueComponent 会根据 `process.env.NODE_ENV` 自动切换开发/生产构建，开发者无需关心环境变量，直接 import/require 主包即可，打包器和 Node 会自动选择最优构建。

- CJS: `dist/ew-vue-component.cjs.js`（开发）/ `dist/ew-vue-component.cjs.prod.js`（生产）
- ESM: `dist/ew-vue-component.esm.js`（开发）/ `dist/ew-vue-component.esm.prod.js`（生产）
- 浏览器全局: `dist/ew-vue-component.global.js` / `dist/ew-vue-component.global.prod.js`
- 类型声明: `dist/ew-vue-component.d.ts`

## 🎯 快速开始

### 全局注册

```javascript
import { createApp } from "vue";
import EwVueComponent from "ew-vue-component";
import App from "./App.vue";

const app = createApp(App);
app.use(EwVueComponent);
app.mount("#app");
```

### 按需引入

```javascript
import { EwVueComponent } from "ew-vue-component";

export default {
  components: {
    EwVueComponent,
  },
};
```

### Composition API

```vue
<script setup>
import { EwVueComponent } from "ew-vue-component";
</script>
```

## 💡 基本用法

### 字符串组件 (HTML 标签)

```vue
<template>
  <!-- 渲染 HTML 元素 -->
  <EwVueComponent is="div" class="container">
    <p>Hello World</p>
  </EwVueComponent>

  <!-- 动态标签切换 -->
  <EwVueComponent :is="currentTag" @click="handleClick">
    动态内容
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const currentTag = ref('button');

const handleClick = () => {
  currentTag.value = currentTag.value === 'button' ? 'div' : 'button';
};
</script>
```

### Vue 组件

```vue
<template>
  <!-- 渲染 Vue 组件 -->
  <EwVueComponent :is="MyComponent" :title="title">
    <template #default>
      <span>插槽内容</span>
    </template>
  </EwVueComponent>

  <!-- 组件切换 -->
  <EwVueComponent :is="currentComponent" v-bind="componentProps" />
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';
import MyComponent from './MyComponent.vue';
import AnotherComponent from './AnotherComponent.vue';

const title = ref('动态标题');
const currentComponent = ref(MyComponent);
const componentProps = ref({ title: 'Hello' });

// 切换组件
const switchComponent = () => {
  currentComponent.value = currentComponent.value === MyComponent 
    ? AnotherComponent 
    : MyComponent;
};
</script>
```

### 异步组件

```vue
<template>
  <!-- 异步组件加载 -->
  <EwVueComponent 
    :is="asyncComponent" 
    @error="handleError"
  >
    <div class="loading">加载中...</div>
  </EwVueComponent>
</template>

<script setup>
import { ref } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const asyncComponent = ref(() => import('./AsyncComponent.vue'));

const handleError = (error) => {
  console.error('组件加载失败:', error);
};
</script>
```

## 🛡️ 错误处理

### 基础错误处理

```vue
<template>
  <!-- 错误边界与回退 -->
  <EwVueComponent 
    :is="maybeInvalidComponent"
    @error="handleError"
  >
    <div class="fallback">
      ⚠️ 组件加载失败
    </div>
  </EwVueComponent>
</template>

<script setup>
import { EwVueComponent } from 'ew-vue-component';

const handleError = (error) => {
  console.error('组件错误:', error);
  // 发送到错误监控服务
};
</script>
```

## ⚡ 性能特性

### 组件缓存

```vue
<template>
  <EwVueComponent 
    :is="heavyComponent"
    :cache="true"
    :cache-key="cacheKey"
    :cache-ttl="300000"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { EwVueComponent } from 'ew-vue-component';

const heavyComponent = () => import('./HeavyComponent.vue');
const componentId = ref('heavy-1');

const cacheKey = computed(() => `heavy-component-${componentId.value}`);
</script>
```

## 🔌 插件系统

### 内置插件

```vue
<template>
  <EwVueComponent 
    :is="currentComponent"
    :plugins="[logPlugin, performancePlugin, errorPlugin]"
  />
</template>

<script setup>
import { EwVueComponent, logPlugin, performancePlugin, errorPlugin } from 'ew-vue-component';
</script>
```

## 📚 API 参考

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `is` | `string \| Component \| (() => Promise<Component>)` | - | **必需**。要渲染的组件 |
| `fallback` | `string \| Component` | `undefined` | 主组件失败时的回退组件 |
| `errorComponent` | `Component` | `undefined` | 自定义错误组件 |
| `cache` | `boolean` | `false` | 启用组件缓存 |
| `cacheKey` | `string` | `''` | 自定义缓存键 |
| `cacheTtl` | `number` | `300000` | 缓存 TTL（毫秒） |
| `plugins` | `Plugin[]` | `[]` | 插件数组 |

### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `error` | `(error: Error)` | 组件渲染失败时触发 |

### 插槽

| 插槽 | 说明 |
|------|------|
| `default` | 默认插槽内容，也用作回退内容 |
| `*` | 所有插槽都会转发到目标组件 |

## 🎨 使用场景

### 动态表单

```vue
<template>
  <form>
    <EwVueComponent 
      v-for="field in formFields"
      :key="field.id"
      :is="field.component"
      v-bind="field.props"
      @input="updateField(field.id, $event)"
    />
  </form>
</template>
```

### 微前端

```vue
<template>
  <EwVueComponent 
    :is="() => loadRemoteComponent(moduleUrl)"
    :cache="true"
    @error="handleMicrofrontendError"
  />
</template>
```

### 内容管理系统

```vue
<template>
  <div>
    <EwVueComponent 
      v-for="block in contentBlocks"
      :key="block.id"
      :is="componentMap[block.type]"
      v-bind="block.props"
    />
  </div>
</template>
```

## 📖 文档

完整的文档、示例和指南，请访问：

- 📚 [完整文档](./docs/zh-CN/index.md)
- 🚀 [快速开始](./docs/zh-CN/guide/index.md)
- 📖 [API 参考](./docs/zh-CN/api/index.md)
- 💡 [示例](./docs/zh-CN/examples/index.md)

## 🤝 贡献

欢迎贡献！请查看我们的[贡献指南](./CONTRIBUTING.md)了解详情。

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/eveningwater/ew-vue-component.git

# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建库
pnpm build

# 本地运行文档
pnpm docs:dev
```

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行测试覆盖率
pnpm test:coverage

# 运行测试监视模式
pnpm test:watch
```

## 📦 浏览器支持

- **Vue 3.x**: 完整支持
- **现代浏览器**: Chrome, Firefox, Safari, Edge
- **TypeScript**: 4.0+
- **Node.js**: 14+

## 📄 许可证

[MIT](./LICENSE) License © 2024-present [eveningwater](https://github.com/eveningwater)

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=eveningwater/ew-vue-component&type=Date)](https://star-history.com/#eveningwater/ew-vue-component&Date)

---

<p align="center">
  <sub>由 <a href="https://github.com/eveningwater">eveningwater</a> 用 ❤️ 构建</sub>
</p>
