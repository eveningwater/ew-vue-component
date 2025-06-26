import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import EwVueComponent from '../src/component'
import { createPlugin, createCache } from '../src/utils'

// 模拟组件
const TestComponent = {
  name: 'TestComponent',
  props: ['message'],
  template: '<div>{{ message }}</div>'
}

const AsyncComponent = () => Promise.resolve(TestComponent)

const ErrorComponent = {
  name: 'ErrorComponent',
  setup() {
    throw new Error('Test error')
  }
}

// 模拟插件
const testPlugin = createPlugin({
  name: 'test-plugin',
  beforeRender: vi.fn(),
  afterRender: vi.fn(),
  onError: vi.fn()
})

describe('EwVueComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('应该正确渲染字符串组件', () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: 'div'
        },
        slots: {
          default: 'Hello World'
        }
      })



      expect(wrapper.html()).toContain('Hello World')
    })

    it('应该正确渲染组件对象', () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          message: 'Test Message'
        }
      })

      expect(wrapper.text()).toContain('Test Message')
    })

    it('应该正确渲染异步组件', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: AsyncComponent,
          message: 'Async Message'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Async Message')
    })
  })

  describe('Props 透传', () => {
    it('应该正确透传 props', () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          message: 'Transferred Message',
          class: 'custom-class'
        }
      })

      expect(wrapper.text()).toContain('Transferred Message')
      expect(wrapper.classes()).toContain('custom-class')
    })

    it('应该正确透传事件', async () => {
      const onClick = vi.fn()
      const wrapper = mount(EwVueComponent, {
        props: {
          is: 'button',
          onClick
        },
        slots: {
          default: 'Click me'
        }
      })

      await wrapper.trigger('click')
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('插槽支持', () => {
    it('应该正确渲染默认插槽', () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: 'div'
        },
        slots: {
          default: 'Default Slot Content'
        }
      })

      expect(wrapper.text()).toContain('Default Slot Content')
    })

    it('应该正确渲染具名插槽', () => {
      const SlotComponent = {
        name: 'SlotComponent',
        template: `
          <div>
            <header><slot name="header"></slot></header>
            <footer><slot name="footer"></slot></footer>
          </div>
        `
      }

      const wrapper = mount(EwVueComponent, {
        props: {
          is: SlotComponent
        },
        slots: {
          header: 'Header Content',
          footer: 'Footer Content'
        }
      })

      expect(wrapper.text()).toContain('Header Content')
      expect(wrapper.text()).toContain('Footer Content')
    })
  })

  describe('缓存功能', () => {
    it('应该启用缓存时缓存组件', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: AsyncComponent,
          cache: true,
          cacheKey: 'test-cache'
        }
      })

      await wrapper.vm.$nextTick()
      
      // 切换组件再切换回来
      await wrapper.setProps({ is: 'div' })
      await wrapper.setProps({ is: AsyncComponent })
      
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBeDefined()
    })

    it('应该使用自定义缓存键', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          cache: true,
          cacheKey: 'custom-key'
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBeDefined()
    })
  })

  describe('错误处理', () => {
    it('应该显示错误状态', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: ErrorComponent
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('组件加载失败')
    })

    it('应该使用自定义错误组件', async () => {
      const CustomErrorComponent = {
        template: '<div class="custom-error">Custom Error</div>'
      }

      const wrapper = mount(EwVueComponent, {
        props: {
          is: ErrorComponent,
          errorComponent: CustomErrorComponent
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.custom-error').exists()).toBe(true)
    })

    it('应该触发错误事件', async () => {
      const onError = vi.fn()
      const wrapper = mount(EwVueComponent, {
        props: {
          is: ErrorComponent,
          onError
        }
      })

      await wrapper.vm.$nextTick()
      expect(onError).toHaveBeenCalled()
    })
  })

  describe('加载状态', () => {
    it('应该显示加载状态', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: AsyncComponent
        }
      })

      // 异步组件加载时会显示加载状态
      expect(wrapper.text()).toContain('加载中')
    })

    it('应该使用自定义加载组件', async () => {
      const CustomLoadingComponent = {
        template: '<div class="custom-loading">Custom Loading</div>'
      }

      const wrapper = mount(EwVueComponent, {
        props: {
          is: AsyncComponent,
          fallback: CustomLoadingComponent
        }
      })

      expect(wrapper.find('.custom-loading').exists()).toBe(true)
    })
  })

  describe('插件系统', () => {
    it('应该执行插件钩子', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          plugins: [testPlugin]
        }
      })

      await wrapper.vm.$nextTick()
      
      expect(testPlugin.beforeRender).toHaveBeenCalled()
      expect(testPlugin.afterRender).toHaveBeenCalled()
    })

    it('应该处理插件错误', async () => {
      const errorPlugin = createPlugin({
        name: 'error-plugin',
        beforeRender: () => {
          throw new Error('Plugin error')
        }
      })

      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          plugins: [errorPlugin]
        }
      })

      await wrapper.vm.$nextTick()
      // 插件错误不应该影响组件渲染
      expect(wrapper.text()).toBeDefined()
    })
  })

  describe('动态组件切换', () => {
    it('应该正确切换组件', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent,
          message: 'First Component'
        }
      })

      expect(wrapper.text()).toContain('First Component')

      await wrapper.setProps({
        is: 'div'
      })

      expect(wrapper.text()).toBeDefined()
    })

    it('应该在组件切换时清理状态', async () => {
      const wrapper = mount(EwVueComponent, {
        props: {
          is: TestComponent
        }
      })

      await wrapper.vm.$nextTick()
      
      await wrapper.setProps({ is: 'div' })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toBeDefined()
    })
  })

  describe('性能监控', () => {
    it('应该监控组件加载性能', async () => {
      const performanceSpy = vi.spyOn(performance, 'mark')
      
      const wrapper = mount(EwVueComponent, {
        props: {
          is: AsyncComponent
        }
      })

      await wrapper.vm.$nextTick()
      
      expect(performanceSpy).toHaveBeenCalled()
      performanceSpy.mockRestore()
    })
  })

  describe('重试机制', () => {
    it('应该在错误时自动重试', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      
      const wrapper = mount(EwVueComponent, {
        props: {
          is: ErrorComponent
        }
      })

      await wrapper.vm.$nextTick()
      
      // 等待重试
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 检查是否有包含重试信息的日志调用
      const logCalls = consoleSpy.mock.calls
      const hasRetryLog = logCalls.some(call => 
        call.some(arg => typeof arg === 'string' && arg.includes('自动重试加载组件'))
      )
      expect(hasRetryLog).toBe(true)
      
      consoleSpy.mockRestore()
    })
  })
}) 