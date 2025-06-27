# 演练场部署指南

本文档说明如何部署 EwVueComponent 演练场项目。

## 📁 项目结构

```
ew-vue-component/
├── playground/                 # 演练场项目
│   ├── src/
│   │   ├── App.vue            # 主应用组件 (基于 @vue/repl)
│   │   ├── main.js            # 应用入口
│   │   ├── style.css          # 全局样式
│   │   └── examples/
│   │       └── index.js       # 示例配置
│   ├── package.json           # 项目配置
│   ├── vite.config.js         # Vite 配置
│   ├── index.html             # HTML 模板
│   └── .github/workflows/
│       └── deploy.yml         # GitHub Actions 部署配置
├── docs/                      # VitePress 文档
├── deploy-all.sh              # 全站部署脚本
└── index.html                 # 项目主页
```

## 🚀 部署方式

### 方式一：手动部署演练场

```bash
cd playground
npm install
npm run build
npm run deploy
```

### 方式二：部署整个项目（推荐）

使用根目录的部署脚本：

```bash
# 在项目根目录执行
./deploy-all.sh
```

这会自动：
1. 构建文档站点
2. 构建演练场
3. 组织文件结构
4. 部署到 GitHub Pages

### 方式三：自动部署（GitHub Actions）

当推送到 `main` 分支时，GitHub Actions 会自动构建和部署演练场。

配置文件：`playground/.github/workflows/deploy.yml`

## 🌐 访问地址

部署完成后，您可以通过以下地址访问：

- **项目主页**: `https://eveningwater.github.io/ew-vue-component/`
- **演练场**: `https://eveningwater.github.io/ew-vue-component/playground/`
- **文档站点**: `https://eveningwater.github.io/ew-vue-component/docs/`

## ⚙️ 配置说明

### GitHub Pages 设置

1. 进入仓库设置 -> Pages
2. Source 选择 "GitHub Actions"
3. 或者选择 "Deploy from a branch" -> `gh-pages` 分支

### 自定义域名

如果需要使用自定义域名：

1. 在 GitHub 仓库设置中配置 Custom domain
2. 修改 `playground/vite.config.js` 中的 `base` 配置
3. 修改 `deploy-all.sh` 中的相关路径

### 环境变量

部署脚本支持以下环境变量：

- `GITHUB_USERNAME`: GitHub 用户名
- `GITHUB_REPO`: 仓库名称
- `CUSTOM_DOMAIN`: 自定义域名（可选）

## 🔧 本地开发

```bash
cd playground
npm install
npm run dev
```

访问 `http://localhost:3000` 查看演练场。

## 📝 添加新示例

在 `src/examples/index.js` 中添加新的示例配置：

```javascript
{
  id: 'example-id',
  title: '示例标题',
  description: '示例描述',
  files: [
    {
      name: 'App.vue',
      content: `<!-- Vue 组件代码 -->`
    }
  ]
}
```

## 🐛 故障排除

### 常见问题

1. **构建失败**: 检查 Node.js 版本（推荐 18+）
2. **部署失败**: 确认 GitHub Pages 已启用
3. **访问 404**: 检查 `base` 路径配置

### 调试步骤

1. 检查构建日志
2. 验证生成的文件
3. 检查 GitHub Actions 日志
4. 确认 GitHub Pages 配置

## 📱 移动端适配

演练场已经过移动端优化，支持：

- 响应式布局
- 触控操作
- 自适应编辑器大小
- 移动端友好的交互

## 🔐 安全考虑

- 演练场运行在沙箱环境中
- 用户代码仅在客户端执行
- 不会访问敏感数据或 API
- 支持 CSP (Content Security Policy)

## 📊 性能优化

演练场实现了以下性能优化：

- 代码分割 (Code Splitting)
- 懒加载 (Lazy Loading)
- 缓存策略
- CDN 加速（如果配置）

## 🌏 国际化

当前支持中文界面，如需添加其他语言：

1. 修改 `src/App.vue` 中的界面文本
2. 添加语言切换功能
3. 更新示例内容

## 📞 技术支持

如遇到部署问题，请：

1. 查看 GitHub Issues
2. 检查文档说明
3. 提交新的 Issue 