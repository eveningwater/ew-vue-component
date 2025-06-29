import {
  defineComponent,
  h,
  ref,
  onErrorCaptured,
  type Component,
  watch,
  onMounted,
  onUnmounted
} from "vue";
import { isString, warn, log, error, createCache, createPluginManager, createPerformanceMonitor, handleComponentError, logPlugin, performancePlugin, errorPlugin, isAsyncComponent, isDevelopment } from "./utils";
import type { VNode } from 'vue'
import type { 
  EwVueComponentProps, 
  ComponentType,
  Plugin,
  PluginContext
} from './types'

// 全局缓存实例
const globalCache = createCache({
  maxSize: 200,
  ttl: 300000, // 5分钟
  onEvict: (key: string) => {
    log(`缓存项已过期: ${key}`)
  }
})

// 全局插件管理器
const globalPluginManager = createPluginManager()

// 注册默认插件
globalPluginManager.register('log', logPlugin)
globalPluginManager.register('performance', performancePlugin)
globalPluginManager.register('error-handler', errorPlugin)

// 全局性能监控器
const globalPerformanceMonitor = createPerformanceMonitor({
  enabled: true,
  threshold: 100,
  onSlowRender: (duration, component) => {
    warn(`组件渲染较慢: ${component} (${duration.toFixed(2)}ms)`)
  }
})


export default defineComponent({
  name: "EwVueComponent",
  props: {
    is: {
      type: [String, Object, Function] as any,
      required: true,
      validator: (value: any) => {
        if (!value) {
          warn('组件不能为空')
          return false
        }
        return true
      }
    },
    fallback: {
      type: [String, Object, Function] as any,
      default: null
    },
    errorComponent: {
      type: [String, Object, Function] as any,
      default: null
    },
    cache: {
      type: Boolean,
      default: false
    },
    cacheKey: {
      type: String,
      default: ''
    },
    cacheTtl: {
      type: Number,
      default: 300000 // 5分钟
    },
    plugins: {
      type: Array as () => Plugin[],
      default: () => []
    }
  },
  emits: {
    error: (error: Error) => true
  },
  setup(props: EwVueComponentProps, { emit, slots, attrs }) {
    const currentComponent = ref<Component | null>(null)
    const isLoading = ref(false)
    const errorState = ref<Error | null>(null)
    const retryCount = ref(0)
    const maxRetries = 3

    // 错误捕获
    onErrorCaptured((err) => {
      error('Component error captured:', String(err))
      const errorObj = err instanceof Error ? err : new Error(String(err))
      errorState.value = errorObj
      retryCount.value++

      // 执行 onError 钩子
      executePlugins('onError', errorObj, pluginContext)

      // 处理错误
      handleComponentError(errorObj, props.is, {
        reportToServer: true,
        showUserMessage: true,
        retryCount: retryCount.value,
        maxRetries
      })

      // 触发错误事件
      emit('error', errorObj)

      // 自动重试
      if (retryCount.value < maxRetries) {
        log(`自动重试加载组件 (${retryCount.value}/${maxRetries})`)
        setTimeout(() => {
          loadComponent(props.is)
        }, 1000 * retryCount.value) // 递增延迟
      }

      return false // 阻止错误向上传播
    })

    // 本地缓存
    const localCache = createCache({
      maxSize: 50,
      ttl: props.cacheTtl
    })

    // 插件上下文
    const pluginContext: PluginContext = {
      component: null,
      data: {},
      utils: {
        warn,
        log
      }
    }

    // 执行插件钩子
    const executePlugins = (hook: 'beforeRender' | 'afterRender' | 'onError', ...args: any[]) => {
      const globalPlugins = globalPluginManager.list().map(name => globalPluginManager.get(name)!)
      const allPlugins = [...globalPlugins, ...(props.plugins || [])]

      allPlugins.forEach(plugin => {
        try {
          const hookFn = plugin[hook]
          if (hookFn) {
            ;(hookFn as (...args: any[]) => void)(...args, pluginContext)
          }
        } catch (err) {
          warn(`插件 ${plugin.name} 的 ${hook} 钩子执行失败:`, err)
        }
      })
    }

    // 同步加载组件
    const loadComponentSync = (component: ComponentType) => {
      if (!component) return

      const cacheKey = props.cacheKey || (isString(component) ? component : JSON.stringify(component))
      
      // 检查缓存
      if (props.cache) {
        const cached = localCache.get(cacheKey) || globalCache.get(cacheKey)
        if (cached) {
          log(`从缓存加载组件: ${cacheKey}`)
          currentComponent.value = cached
          return
        }
      }

      errorState.value = null

      try {
        // 执行 beforeRender 钩子
        pluginContext.component = component
        executePlugins('beforeRender', component, attrs, pluginContext)

        // 开始性能监控
        globalPerformanceMonitor.start(`load-${cacheKey}`)

        // 同步解析组件
        let resolvedComponent: Component
        if (isString(component)) {
          resolvedComponent = component as any
        } else if (component && typeof component === 'object') {
          if (typeof (component as any).render === 'function' || 
              (component as any).template || 
              typeof (component as any).setup === 'function') {
            resolvedComponent = component as Component
          } else {
            throw new Error('无效的组件类型')
          }
        } else if (typeof component === 'function' && !isAsyncComponent(component)) {
          resolvedComponent = component as Component
        } else {
          throw new Error('无效的组件类型')
        }
        
        // 结束性能监控
        globalPerformanceMonitor.end(`load-${cacheKey}`)

        // 缓存组件
        if (props.cache) {
          localCache.set(cacheKey, resolvedComponent)
          globalCache.set(cacheKey, resolvedComponent)
        }

        currentComponent.value = resolvedComponent
        retryCount.value = 0

        // 执行 afterRender 钩子
        executePlugins('afterRender', resolvedComponent, attrs, pluginContext)

      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        errorState.value = errorObj
        retryCount.value++

        // 执行 onError 钩子
        executePlugins('onError', errorObj, pluginContext)

        // 处理错误
        handleComponentError(errorObj, component, {
          reportToServer: true,
          showUserMessage: true,
          retryCount: retryCount.value,
          maxRetries
        })

        // 触发错误事件
        emit('error', errorObj)

        // 自动重试
        if (retryCount.value < maxRetries) {
          log(`自动重试加载组件 (${retryCount.value}/${maxRetries})`)
          setTimeout(() => {
            loadComponentSync(component)
          }, 1000 * retryCount.value) // 递增延迟
        }
      }
    }

    // 异步加载组件
    const loadComponentAsync = async (component: ComponentType) => {
      if (!component) return

      const cacheKey = props.cacheKey || (isString(component) ? component : JSON.stringify(component))
      
      // 检查缓存
      if (props.cache) {
        const cached = localCache.get(cacheKey) || globalCache.get(cacheKey)
        if (cached) {
          log(`从缓存加载组件: ${cacheKey}`)
          currentComponent.value = cached
          isLoading.value = false
          return
        }
      }

      isLoading.value = true
      errorState.value = null

      try {
        // 执行 beforeRender 钩子
        pluginContext.component = component
        executePlugins('beforeRender', component, attrs, pluginContext)

        // 开始性能监控
        globalPerformanceMonitor.start(`load-${cacheKey}`)

        // 异步解析组件
        const result = await (component as () => Promise<Component>)()
        
        // 结束性能监控
        globalPerformanceMonitor.end(`load-${cacheKey}`)

        // 缓存组件
        if (props.cache) {
          localCache.set(cacheKey, result)
          globalCache.set(cacheKey, result)
        }

        currentComponent.value = result
        retryCount.value = 0

        // 执行 afterRender 钩子
        executePlugins('afterRender', result, attrs, pluginContext)

      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        errorState.value = errorObj
        retryCount.value++

        // 执行 onError 钩子
        executePlugins('onError', errorObj, pluginContext)

        // 处理错误
        handleComponentError(errorObj, component, {
          reportToServer: true,
          showUserMessage: true,
          retryCount: retryCount.value,
          maxRetries
        })

        // 触发错误事件
        emit('error', errorObj)

        // 自动重试
        if (retryCount.value < maxRetries) {
          log(`自动重试加载组件 (${retryCount.value}/${maxRetries})`)
          setTimeout(() => {
            loadComponentAsync(component)
          }, 1000 * retryCount.value) // 递增延迟
        }
      } finally {
        isLoading.value = false
      }
    }

    // 加载组件的统一入口
    const loadComponent = async (component: ComponentType) => {
      if (isAsyncComponent(component)) {
        await loadComponentAsync(component)
      } else {
        loadComponentSync(component)
      }
    }

    // 渲染组件
    const renderComponent = (): VNode | null => {
      // 显示加载状态
      if (isLoading.value) {
        if (props.fallback) {
          return h(props.fallback as any, attrs, slots)
        }
        return h('div', { class: 'ew-vue-component-loading' }, '加载中...')
      }

      // 显示错误状态
      if (errorState.value) {
        if (props.errorComponent) {
          return h(props.errorComponent as any, { 
            error: errorState.value,
            retry: () => loadComponent(props.is)
          }, slots)
        }
        // 如果有默认插槽，则回退到默认插槽内容
        if (slots.default) {
          return h('div', { class: 'ew-vue-component-fallback' }, slots.default())
        }
        // 否则显示错误UI
        return h('div', { 
          class: 'ew-vue-component-error',
          onClick: () => loadComponent(props.is)
        }, [
          h('div', '组件加载失败'),
          h('button', { class: 'retry-btn' }, '重试')
        ])
      }

      // 渲染当前组件
      if (currentComponent.value) {
        // 排除内部props，只传递用户定义的props和attrs
        const componentProps = { ...attrs }
        for (const key in props) {
          if (key !== 'is' && key !== 'fallback' && key !== 'errorComponent' && 
              key !== 'cache' && key !== 'cacheKey' && key !== 'cacheTtl' && key !== 'plugins') {
            componentProps[key] = (props as any)[key]
          }
        }
        
        return h(currentComponent.value, componentProps, slots)
      }

      return null
    }

    // 监听组件变化
    watch(() => props.is, async (newComponent) => {
      if (newComponent !== currentComponent.value) {
        await loadComponent(newComponent)
      }
    }, { immediate: true })

    // 监听缓存相关属性变化
    watch([() => props.cache, () => props.cacheKey, () => props.cacheTtl], () => {
      // 重新加载组件以应用新的缓存设置
      if (props.is) {
        loadComponent(props.is)
      }
    })

    // 监听插件变化
    watch(() => props.plugins, () => {
      // 插件变化时重新加载组件
      if (props.is) {
        loadComponent(props.is)
      }
    }, { deep: true })

    // 生命周期钩子
    onMounted(() => {
      log('EwVueComponent 已挂载')
    })

    onUnmounted(() => {
      log('EwVueComponent 已卸载')
      // 清理本地缓存
      localCache.clear()
    })

    return () => renderComponent()
  }
});
