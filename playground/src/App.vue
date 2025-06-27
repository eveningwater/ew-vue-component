<template>
  <div id="app">
    <header class="header">
      <h1>EwVueComponent 演练场</h1>
      <p>在线体验和测试 EwVueComponent 的功能</p>
    </header>

    <div class="main-content">
      <aside class="sidebar">
        <div class="sidebar-header">选择示例</div>
        <div class="examples-list">
          <div v-for="example in examples" :key="example.id" class="example-item"
            :class="{ active: currentExample?.id === example.id }" @click="switchExample(example)">
            <div class="example-title">{{ example.title }}</div>
            <div class="example-description">{{ example.description }}</div>
          </div>
        </div>
      </aside>

      <main class="repl-container">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>正在加载演练场...</p>
        </div>

        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="retryInit">重试</button>
        </div>

        <Repl v-else-if="store" :key="replKey" :store="store" :editor="Monaco" :showCompileOutput="false"
          :showImportMap="false" :clearConsole="false" :ssr="false" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Repl, useStore, useVueImportMap, compileFile } from '@vue/repl'
import { ref, onMounted, nextTick } from 'vue'
import Monaco from '@vue/repl/monaco-editor'
import { examples } from './examples/index.js'

const loading = ref(true)
const currentExample = ref(null)
const error = ref('')
const store = ref(null)
const replKey = ref(0)

// 替换或添加文件到store的函数（基于Element Plus playground的方法）
const replaceOrAddFilesToStore = async (files, store) => {
  const newFileNames = []
  
  for (const file of files) {
    const filename = file.name
    const content = file.content
    
    // 智能文件处理逻辑
    let actualFileName = filename
    
    if (filename === 'App.vue' && store.files['src/App.vue']) {
      // 如果示例文件是 App.vue 且存在 src/App.vue，则替换 src/App.vue 的内容
      actualFileName = 'src/App.vue'
      store.files['src/App.vue'].code = content
      store.files['src/App.vue'].hidden = false
      // 设置主文件为 src/App.vue
      store.mainFile = 'src/App.vue'
    } else if (store.files[filename]) {
      // 文件已存在，直接替换内容
      store.files[filename].code = content
      store.files[filename].hidden = false
    } else {
      // 文件不存在，创建新文件
      store.addFile(filename, content)
      // 确保新添加的文件可见
      if (store.files[filename]) {
        store.files[filename].hidden = false
      }
    }
    
    newFileNames.push(actualFileName)
  }
  
  return newFileNames
}

const switchExample = async (example) => {
  if (!store.value || !example || !example.files) {
    return
  }
  
  try {
    currentExample.value = example
    
    // 验证示例文件
    const validFiles = example.files.filter(file => 
      file && 
      typeof file.name === 'string' && 
      typeof file.content === 'string' &&
      file.name.trim() !== '' &&
      file.content.trim() !== ''
    )
    
    if (validFiles.length === 0) {
      throw new Error('示例不包含有效的文件')
    }
    
    // 1. 首先隐藏现有的用户文件（包括默认的src/App.vue）
    const systemFiles = ['import-map.json']
    const currentFiles = Object.keys(store.value.files || {})
    
    for (const filename of currentFiles) {
      if (!systemFiles.includes(filename.toLowerCase()) && 
          !filename.startsWith('__')) {
        // 将现有文件标记为hidden，特别是默认的src/App.vue
        if (store.value.files[filename]) {
          store.value.files[filename].hidden = true
        }
      }
    }
    
    // 2. 添加新的示例文件
    const newFileNames = await replaceOrAddFilesToStore(validFiles, store.value)
    
    // 3. 重新编译所有可见文件，确保预览正确更新
    const allFiles = Object.entries(store.value.files)
    const visibleFiles = allFiles.filter(([_, file]) => !file.hidden)
    
    // 清空之前的错误
    store.value.errors = []
    
    // 编译所有可见文件
    for (const [filename, file] of visibleFiles) {
      try {
        const errors = await compileFile(store.value, file)
        if (errors && errors.length > 0) {
          store.value.errors.push(...errors)
        }
      } catch (err) {
        // 静默处理编译错误
      }
    }
    
    // 4. 设置新的主文件和活动文件
    if (newFileNames.length > 0) {
      const mainFile = newFileNames.find(name => name.includes('App.vue')) || newFileNames[0];
      
      // 重要：设置新的主文件，这样预览就会执行新文件而不是默认的src/App.vue
      store.value.mainFile = mainFile
      
      try {
        store.value.setActive(mainFile)
      } catch (err) {
        // 静默处理错误
      }
    }
    
    // 5. 触发预览更新
    await nextTick()
    replKey.value += 1

  } catch (err) {
    error.value = `切换示例失败: ${err.message}`
  }
}

const initializeStore = async () => {
  try {
    // 使用 @vue/repl 的标准方式初始化，指定使用支持模板编译的Vue版本
    const { importMap: builtinImportMap, vueVersion } = useVueImportMap({
      // 使用支持模板编译的Vue版本
      runtimeDev: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      runtimeProd: 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js'
    })

    // 创建 store
    const newStore = useStore({
      builtinImportMap,
      vueVersion
    })

    // 设置自定义导入映射，使用支持模板编译的Vue
    if (newStore.setImportMap) {
      newStore.setImportMap({
        ...builtinImportMap.value,
        imports: {
          ...builtinImportMap.value.imports,
          'vue': 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
          'ew-vue-component': 'https://unpkg.com/ew-vue-component@0.0.1/dist/index.esm.js'
        }
      })
    }

    store.value = newStore
    loading.value = false

    // 直接替换默认的src/App.vue文件内容为欢迎页面
    if (newStore.files['src/App.vue']) {
      newStore.files['src/App.vue'].code = `<template>
  <div class="welcome">
    <div class="logo">
      <h1>🎯 EwVueComponent</h1>
      <p class="subtitle">强大的Vue组件动态渲染库</p>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>💡 智能渲染</h3>
        <p>支持动态组件渲染和切换</p>
      </div>
      <div class="feature">
        <h3>🔧 易于使用</h3>
        <p>简单的API，开箱即用</p>
      </div>
      <div class="feature">
        <h3>⚡ 高性能</h3>
        <p>优化的渲染性能</p>
      </div>
    </div>
    
    <div class="get-started">
      <p>👈 从左侧选择示例开始体验</p>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  text-align: center;
}

.logo h1 {
  color: #42b883;
  font-size: 3em;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 400px;
  margin-bottom: 40px;
}

.feature {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.feature:hover {
  transform: translateY(-2px);
}

.feature h3 {
  color: #2d3748;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.feature p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.get-started {
  background: #42b883;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
}

.get-started p {
  margin: 0;
}
</style>`
      
      // 手动编译文件以确保更新生效
      try {
        await compileFile(newStore, newStore.files['src/App.vue'])
      } catch (err) {
        // 静默处理编译错误
      }
    }

    // 强制刷新预览
    await nextTick()
    replKey.value += 1
    
  } catch (err) {
    error.value = `初始化失败: ${err.message}`
    loading.value = false
  }
}

const retryInit = async () => {
  loading.value = true
  error.value = ''
  await initializeStore()
}

onMounted(async () => {
  await nextTick()
  await initializeStore()
})
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  background: linear-gradient(135deg, #42b883 0%, #369970 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 2em;
  font-weight: 600;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.main-content {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
}

.examples-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.example-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-item:hover {
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.1);
}

.example-item.active {
  border-color: #42b883;
  background: #f0fff4;
}

.example-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.example-description {
  font-size: 0.9em;
  color: #718096;
  line-height: 1.4;
}

.repl-container {
  flex: 1;
  position: relative;
  min-height: 0;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading p,
.error p {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.error p {
  color: #e53e3e;
}

.error button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.error button:hover {
  background: #369970;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: 200px;
  }

  .examples-list {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px;
  }

  .example-item {
    min-width: 200px;
    margin-right: 8px;
    margin-bottom: 0;
  }
}
</style>