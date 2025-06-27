# EwVueComponent 演练场

这是一个基于 [@vue/repl](https://github.com/vuejs/repl) 的在线演练场，专门用于演示和测试 EwVueComponent 的各种用法。

## 功能特性

- 🎯 **在线编辑器**: 基于 Monaco Editor 的代码编辑体验
- 🔄 **实时预览**: 即时查看代码运行结果
- 📚 **示例库**: 内置多个 EwVueComponent 使用示例
- 🎨 **语法高亮**: 支持 Vue SFC 语法高亮
- 📱 **响应式设计**: 适配不同设备尺寸

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看演练场。

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署

### 部署到 GitHub Pages

```bash
npm run deploy
```

此命令会自动构建项目并部署到 GitHub Pages。

## 示例列表

当前包含以下示例：

1. **基础用法** - 展示 EwVueComponent 的基本使用方式
2. **动态组件切换** - 演示如何动态切换不同的组件

## 技术栈

- **Vue 3** - 前端框架
- **@vue/repl** - Vue 在线编辑器
- **Vite** - 构建工具
- **EwVueComponent** - 动态组件库

## 项目结构

```
playground/
├── src/
│   ├── components/          # 组件目录
│   ├── examples/            # 示例配置
│   │   └── index.js        # 示例列表
│   ├── App.vue             # 主应用组件
│   ├── main.js             # 应用入口
│   └── style.css           # 全局样式
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
└── package.json            # 项目配置
```

## 贡献指南

欢迎贡献新的示例或改进现有功能：

1. Fork 本项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 提交 Pull Request

### 添加新示例

要添加新的示例，请在 `src/examples/index.js` 中添加新的示例配置：

```javascript
{
  id: 'your-example-id',
  title: '示例标题',
  description: '示例描述',
  files: [
    {
      name: 'App.vue',
      content: `<!-- 您的 Vue 代码 -->`
    }
  ]
}
```

## 许可证

MIT License 