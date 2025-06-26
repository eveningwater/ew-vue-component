import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick } from 'vue'
import plugin, { EwVueComponent } from '../src/index'

describe('集成测试', () => {
  it('应该在实际应用中使用插件', () => {
    const TestApp = defineComponent({
      name: 'TestApp',
      render() {
        return h('div', null, [
          h(EwVueComponent, { is: 'div' }, {
            default: () => h('span', null, 'Default Content')
          })
        ])
      }
    })
    const app = createApp(TestApp)
    app.use(plugin)
    const wrapper = mount(TestApp)
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.text()).toBe('Default Content')
  })

  it('应该支持动态组件切换', async () => {
    const TestComponent1 = defineComponent({
      name: 'TestComponent1',
      render() {
        return h('div', { class: 'component-1' }, 'Component 1')
      }
    })
    const TestComponent2 = defineComponent({
      name: 'TestComponent2',
      render() {
        return h('div', { class: 'component-2' }, 'Component 2')
      }
    })
    const TestApp = defineComponent({
      name: 'TestApp',
      data() {
        return {
          currentComponent: TestComponent1
        }
      },
      render() {
        return h('div', null, [
          h(EwVueComponent, { is: this.currentComponent })
        ])
      }
    })
    const app = createApp(TestApp)
    app.use(plugin)
    const wrapper = mount(TestApp)
    // 初始状态
    expect(wrapper.find('.component-1').exists()).toBe(true)
    expect(wrapper.text()).toBe('Component 1')
    // 切换组件
    await wrapper.setData({ currentComponent: TestComponent2 })
    expect(wrapper.find('.component-2').exists()).toBe(true)
    expect(wrapper.text()).toBe('Component 2')
  })

  it('应该支持字符串组件名称', () => {
    const TestApp = defineComponent({
      name: 'TestApp',
      render() {
        return h('div', null, [
          h(EwVueComponent, { is: 'section' }, {
            default: () => [
              h('h1', null, 'Title'),
              h('p', null, 'Content')
            ]
          })
        ])
      }
    })
    const app = createApp(TestApp)
    app.use(plugin)
    const wrapper = mount(TestApp)
    expect(wrapper.find('h1').text()).toBe('Title')
    expect(wrapper.find('p').text()).toBe('Content')
  })

  it('应该处理组件渲染错误并回退', async () => {
    const ErrorComponent = defineComponent({
      name: 'ErrorComponent',
      setup() {
        throw new Error('Simulated error')
      }
    })
    const TestApp = defineComponent({
      name: 'TestApp',
      data() {
        return {
          component: ErrorComponent
        }
      },
      render() {
        return h('div', null, [
          h(EwVueComponent, { is: this.component }, {
            default: () => h('div', { class: 'fallback' }, 'Fallback Content')
          })
        ])
      }
    })
    const app = createApp(TestApp)
    app.use(plugin)
    const wrapper = mount(TestApp)
    await nextTick()
    expect(wrapper.find('.fallback').exists()).toBe(true)
    expect(wrapper.text()).toBe('Fallback Content')
  })
}) 