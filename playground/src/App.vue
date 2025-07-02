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
        
        <Repl v-else-if="store" :store="store" :editor="Monaco" :showCompileOutput="false"
          :showImportMap="false" :clearConsole="false" :ssr="false" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Repl, useStore, useVueImportMap, compileFile } from '@vue/repl'
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Monaco from '@vue/repl/monaco-editor'
import { examples } from './examples/index.js'
import welcome from './template/welcome.vue?raw';

const loading = ref(true)
const currentExample = ref(null)
const error = ref('')
const store = ref(null)

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

// 防抖函数，避免频繁切换导致Monaco Editor错误
let switchingExample = false

const switchExample = async (example) => {
  if (!store.value || !example || !example.files || switchingExample || isDestroyed) {
    return
  }
  
  // 防止频繁切换
  switchingExample = true
  
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
    
    // 3. 设置新的主文件和活动文件
    if (newFileNames.length > 0) {
      const mainFile = newFileNames.find(name => name.includes('App.vue')) || newFileNames[0];
      
      // 重要：设置新的主文件，这样预览就会执行新文件而不是默认的src/App.vue
      store.value.mainFile = mainFile
      
      try {
        // 使用延迟设置活动文件，避免Monaco Editor冲突
        setTimeout(() => {
          if (!isDestroyed && store.value) {
            try {
              store.value.setActive(mainFile)
            } catch (err) {
              // 静默处理错误
            }
          }
        }, 100)
      } catch (err) {
        // 静默处理错误
      }
    }
    
    // 4. 延迟重新编译，避免频繁操作
    await nextTick()
    
    // 清空之前的错误
    store.value.errors = []
    
    // 编译所有可见文件
    const allFiles = Object.entries(store.value.files)
    const visibleFiles = allFiles.filter(([_, file]) => !file.hidden)
    
    for (const [filename, file] of visibleFiles) {
      if (isDestroyed || !store.value) break
      
      try {
        const errors = await compileFile(store.value, file)
        if (errors && errors.length > 0 && store.value) {
          store.value.errors.push(...errors)
        }
      } catch (err) {
        // 静默处理编译错误
      }
    }
    
  } catch (err) {
    // 忽略Monaco Editor的取消错误
    if (!err.message || !err.message.includes('Canceled')) {
      error.value = `切换示例失败: ${err.message}`
    }
  } finally {
    // 延迟释放锁，防止过快的切换
    setTimeout(() => {
      switchingExample = false
    }, 300)
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
          'ew-vue-component': 'https://unpkg.com/ew-vue-component@0.0.2-beta.5/dist/index.esm.js'
        }
      })
    }
    
    store.value = newStore
    loading.value = false
    
    // 直接替换默认的src/App.vue文件内容为欢迎页面
    if (newStore.files['src/App.vue']) {
      newStore.files['src/App.vue'].code = welcome;
      
      // 手动编译文件以确保更新生效
      try {
        await compileFile(newStore, newStore.files['src/App.vue'])
      } catch (err) {
        // 静默处理编译错误
      }
    }

    // 等待编译完成
    await nextTick()
    
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

// 清理函数
let isDestroyed = false
let originalConsoleError = null

onMounted(async () => {
  // 捕获Monaco Editor的全局错误
  originalConsoleError = console.error
  console.error = (...args) => {
    const message = args.join(' ')
    // 忽略Monaco Editor的取消和清理相关错误
    if (message.includes('Canceled') || 
        message.includes('WordHighlighter') || 
        message.includes('DisposableStore') ||
        message.includes('Delayer')) {
      return
    }
    originalConsoleError.apply(console, args)
  }
  
  await nextTick()
  await initializeStore()
})

onBeforeUnmount(() => {
  isDestroyed = true
  switchingExample = false
  
  // 恢复原始的console.error
  if (originalConsoleError) {
    console.error = originalConsoleError
  }
  
  // 清理store
  if (store.value) {
    try {
      // 静默清理，避免错误
      store.value = null
    } catch (err) {
      // 忽略清理错误
    }
  }
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