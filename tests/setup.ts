import { config } from '@vue/test-utils'

// 让 isDevelopment() 在测试环境下始终返回 true
// @ts-ignore
global.__EW_DEV__ = true

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