# 测试说明

本项目使用 Vitest 作为测试框架，@vue/test-utils 作为 Vue 组件测试工具。

## 测试文件结构

```
tests/
├── setup.ts          # 测试环境设置
├── utils.test.ts     # 工具函数测试
├── component.test.ts # 组件测试
├── plugin.test.ts    # 插件测试
├── integration.test.ts # 集成测试
└── types.d.ts        # 类型声明
```

## 运行测试

### 安装依赖
```bash
pnpm install
```

### 运行所有测试
```bash
pnpm test
```

### 运行测试并生成覆盖率报告
```bash
pnpm test:coverage
```

### 运行测试UI界面
```bash
pnpm test:ui
```

### 运行单次测试（CI环境）
```bash
pnpm test:run
```

## 测试覆盖范围

### 工具函数测试 (utils.test.ts)
- `isString` 函数的类型守卫功能
- `warn` 函数的控制台输出

### 组件测试 (component.test.ts)
- 基本渲染功能（字符串组件、组件对象、VNode）
- 插槽处理（默认插槽、具名插槽）
- 错误处理和回退机制
- 边界情况处理
- 组件属性传递

### 插件测试 (plugin.test.ts)
- 插件安装功能
- 导出验证

### 集成测试 (integration.test.ts)
- 实际应用中的使用场景
- 动态组件切换
- 错误处理集成

## 测试最佳实践

1. **测试命名**: 使用描述性的测试名称，说明测试的目的
2. **测试组织**: 使用 `describe` 块组织相关测试
3. **断言**: 使用明确的断言，验证具体的行为
4. **模拟**: 适当使用 `vi.spyOn` 和 `vi.fn()` 进行模拟
5. **清理**: 在测试后清理模拟和副作用

## 覆盖率目标

- 语句覆盖率: > 90%
- 分支覆盖率: > 85%
- 函数覆盖率: > 95%
- 行覆盖率: > 90% 