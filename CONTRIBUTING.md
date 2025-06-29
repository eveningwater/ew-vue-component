# 贡献指南

感谢您对 EwVueComponent 项目的关注和贡献！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 添加新功能
- 🧪 编写测试用例

## 📋 目录

- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [测试指南](#测试指南)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [发布流程](#发布流程)

## 🛠️ 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- Git

### 克隆项目

```bash
git clone https://github.com/eveningwater/ew-vue-component.git
cd ew-vue-component
```

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建库
pnpm build

# 运行测试
pnpm test

# 运行测试（单次）
pnpm test:run

# 生成测试覆盖率报告
pnpm test:coverage

# 启动文档开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 启动演练场开发服务器
pnpm playground:dev

# 构建演练场
pnpm playground:build

# 部署所有内容到 GitHub Pages
pnpm deploy:all
```

## 📁 项目结构

```
ew-vue-component/
├── src/                    # 源代码
│   ├── component.ts        # 主组件实现
│   ├── plugin.ts          # Vue 插件
│   ├── utils.ts           # 工具函数
│   ├── types.ts           # TypeScript 类型定义
│   └── index.ts           # 主入口文件
├── tests/                 # 测试文件
│   ├── component.test.ts  # 组件测试
│   ├── plugin.test.ts     # 插件测试
│   ├── utils.test.ts      # 工具函数测试
│   ├── integration.test.ts # 集成测试
│   └── setup.ts           # 测试设置
├── docs/                  # 文档站点
│   ├── .vitepress/        # VitePress 配置
│   ├── zh-CN/             # 中文文档
│   └── en/                # 英文文档
├── playground/            # 在线演练场
│   └── src/               # 演练场源码
├── dist/                  # 构建输出
└── deploy-all.sh          # 部署脚本
```

## 🔄 开发流程

### 1. 创建分支

```bash
# 从 main 分支创建新的功能分支
git checkout -b feature/your-feature-name

# 或者创建 bug 修复分支
git checkout -b fix/your-bug-fix
```

### 2. 开发

- 在 `src/` 目录下编写代码
- 在 `tests/` 目录下编写对应的测试
- 更新相关文档

### 3. 测试

确保所有测试通过：

```bash
pnpm test:run
```

### 4. 构建

确保构建成功：

```bash
pnpm build
```

## 📏 代码规范

### TypeScript 规范

- 使用 TypeScript 编写所有代码
- 为公共 API 提供完整的类型定义
- 优先使用接口而不是类型别名来定义对象结构
- 使用严格的 TypeScript 配置

### 代码风格

- 使用 2 个空格缩进
- 使用分号结尾
- 使用单引号
- 每行最大长度 100 字符
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类和接口

### 示例

```typescript
// ✅ 好的示例
interface ComponentOptions {
  name: string;
  props?: Record<string, any>;
  retryCount?: number;
}

export function createComponent(options: ComponentOptions): Component {
  const { name, props = {}, retryCount = 3 } = options;
  
  return {
    name,
    props,
    setup() {
      // 组件逻辑
    }
  };
}

// ❌ 不好的示例
type componentOptions = {
  name:string
  props?:any
  retryCount?:number
}

export function createComponent(options:componentOptions):any{
  const {name,props={},retryCount=3}=options
  return{
    name,props,
    setup(){
      // 组件逻辑
    }
  }
}
```

## 🧪 测试指南

### 测试原则

- 每个功能都应该有对应的测试
- 测试应该覆盖正常情况和边界情况
- 测试应该是独立的，不依赖于其他测试
- 使用描述性的测试名称

### 测试结构

```typescript
describe('功能模块名', () => {
  beforeEach(() => {
    // 测试前的设置
  });

  afterEach(() => {
    // 测试后的清理
  });

  describe('具体功能', () => {
    it('应该执行预期的行为', () => {
      // 测试代码
    });

    it('应该处理错误情况', () => {
      // 错误处理测试
    });
  });
});
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test component.test.ts

# 生成覆盖率报告
pnpm test:coverage
```

## 📝 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式修改（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD 相关

### 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 示例

```bash
# 新功能
git commit -m "feat(component): add retry mechanism for failed components"

# Bug 修复
git commit -m "fix(utils): handle null values in error handler"

# 文档更新
git commit -m "docs: update installation guide"

# 重构
git commit -m "refactor(plugin): simplify error handling logic"
```

## 🔀 Pull Request 流程

### 1. 提交前检查

- [ ] 所有测试通过
- [ ] 代码构建成功
- [ ] 代码符合规范
- [ ] 相关文档已更新
- [ ] 提交信息符合规范

### 2. 创建 Pull Request

1. 推送分支到 GitHub
2. 创建 Pull Request
3. 填写 PR 模板
4. 等待代码审查

### 3. PR 模板

```markdown
## 📋 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 重构
- [ ] 性能优化
- [ ] 其他

## 📝 变更描述
简要描述本次变更的内容和原因。

## 🧪 测试
- [ ] 添加了新的测试用例
- [ ] 所有现有测试通过
- [ ] 手动测试通过

## 📚 文档
- [ ] 更新了相关文档
- [ ] 添加了 API 文档
- [ ] 更新了示例代码

## 💥 破坏性变更
如果有破坏性变更，请详细说明。

## 📸 截图/演示
如果适用，请提供截图或演示链接。
```

### 4. 代码审查

- 维护者会审查您的代码
- 可能会提出修改建议
- 请及时响应并进行必要的修改

## 🚀 发布流程

发布由维护者负责，流程如下：

1. 确保所有测试通过
2. 更新版本号
3. 更新 CHANGELOG
4. 创建 Git 标签
5. 发布到 npm
6. 部署文档和演练场

## 🤝 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性别化语言或图像，以及不受欢迎的性关注或挑逗
- 恶意评论、人身攻击或政治攻击
- 公开或私下的骚扰
- 未经明确许可发布他人的私人信息
- 在专业环境中可能被认为不适当的其他行为

## 📞 联系方式

如果您有任何问题或需要帮助，可以通过以下方式联系我们：

- 📧 Email: [854806732@qq.com](mailto:854806732@qq.com)
- 🐛 Issues: [GitHub Issues](https://github.com/eveningwater/ew-vue-component/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/eveningwater/ew-vue-component/discussions)

## 🎉 致谢

感谢所有为 EwVueComponent 项目做出贡献的开发者！

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](LICENSE) 下获得许可。

---

再次感谢您的贡献！🙏 