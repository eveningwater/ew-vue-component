import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      'path': 'path-browserify',
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-repl': ['@vue/repl'],
          'codemirror': ['@vue/repl/codemirror-editor']
        },
        external: [],
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['@vue/repl/codemirror-editor'],
    exclude: ['@vue/repl']
  },
  worker: {
    format: 'es'
  }
}) 