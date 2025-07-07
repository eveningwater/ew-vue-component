<template>
  <div class="style-demo">
    <h1>EwVueComponent 默认样式演示</h1>
    
    <!-- 加载状态演示 -->
    <section>
      <h2>加载状态 (Loading State)</h2>
      <div class="ew-vue-component-loading">
        加载中...
      </div>
    </section>

    <!-- 回退组件演示 -->
    <section>
      <h2>回退组件 (Fallback Component)</h2>
      <div class="ew-vue-component-fallback">
        <p>这是一个回退组件的示例</p>
        <p>当主组件无法加载时显示</p>
      </div>
    </section>

    <!-- 错误状态演示 -->
    <section>
      <h2>错误状态 (Error State)</h2>
      <div class="ew-vue-component-error" @click="handleRetry">
        <div>组件加载失败</div>
        <button class="ew-vue-component-retry-btn">重试</button>
      </div>
    </section>

    <!-- 单独的重试按钮演示 -->
    <section>
      <h2>重试按钮 (Retry Button)</h2>
      <button class="ew-vue-component-retry-btn" @click="handleRetry">
        重新加载
      </button>
      <button class="ew-vue-component-retry-btn" disabled>
        重试按钮 (禁用状态)
      </button>
    </section>

    <!-- 响应式测试 -->
    <section>
      <h2>响应式设计测试</h2>
      <p>请尝试调整浏览器窗口大小以测试响应式设计</p>
    </section>

    <!-- 深色模式提示 -->
    <section>
      <h2>深色模式支持</h2>
      <p>本组件支持系统深色模式，请在系统设置中切换主题以查看效果</p>
    </section>
  </div>
</template>

<script setup>
const handleRetry = () => {
  console.log('重试操作被触发');
  alert('重试操作被触发！');
};
</script>

<style>
/* 导入组件样式 */
@import url('https://unpkg.com/ew-vue-component@0.0.2-beta.7/dist/ew-vue-component.css');
</style>

<style scoped>
.style-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.style-demo h1 {
  text-align: center;
  color: #2563eb;
  margin-bottom: 2rem;
}

.style-demo h2 {
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin: 2rem 0 1rem 0;
}

.style-demo section {
  margin-bottom: 2rem;
}

.style-demo p {
  color: #6b7280;
  line-height: 1.6;
}

/* 演示区域间距 */
.ew-vue-component-retry-btn + .ew-vue-component-retry-btn {
  margin-left: 1rem;
}

/* 深色模式下的标题颜色 */
@media (prefers-color-scheme: dark) {
  .style-demo h1 {
    color: #60a5fa;
  }
  
  .style-demo h2 {
    color: #d1d5db;
    border-color: #374151;
  }
  
  .style-demo p {
    color: #9ca3af;
  }
}
</style> 