import { config } from '@vue/test-utils'

// 配置全局测试设置
config.global.stubs = {
  // 可以在这里添加全局stub
}

// 模拟console.warn以避免测试输出中的警告
const originalWarn = console.warn
beforeAll(() => {
  console.warn = vi.fn()
})

afterAll(() => {
  console.warn = originalWarn
}) 