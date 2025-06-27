#!/bin/bash

# EwVueComponent 全站部署脚本
# 用于同时部署文档站点和演练场到 GitHub Pages

set -e

echo "🚀 开始部署 EwVueComponent 项目..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 创建临时目录用于部署
TEMP_DIR="temp-deploy"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📚 构建文档站点..."
cd docs
pnpm install --frozen-lockfile
pnpm run build
cd ..

echo "🎮 构建演练场..."
cd playground
pnpm install --frozen-lockfile
pnpm run build
cd ..

echo "📁 整理部署文件..."
# 创建文档子目录并复制文档文件
mkdir -p $TEMP_DIR/docs
cp -r docs/.vitepress/dist/* $TEMP_DIR/docs/

# 创建演练场子目录
mkdir -p $TEMP_DIR/playground
cp -r playground/dist/* $TEMP_DIR/playground/

# 创建重定向文件
cat > $TEMP_DIR/index.html << EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EwVueComponent - 强大的 Vue 动态组件库</title>
    <meta http-equiv="refresh" content="0; url=./docs/">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin-bottom: 30px; opacity: 0.9; }
        .links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        a {
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            border: 2px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            font-weight: 500;
        }
        a:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.6);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧩 EwVueComponent</h1>
        <p>强大而灵活的 Vue 3 动态组件库</p>
        <div class="links">
            <a href="./docs/">📚 查看文档</a>
            <a href="./playground/">🎮 在线演练场</a>
            <a href="https://github.com/eveningwater/ew-vue-component">💻 GitHub</a>
            <a href="https://www.npmjs.com/package/ew-vue-component">📦 NPM</a>
        </div>
    </div>
    <script>
        // 3秒后自动跳转到文档
        setTimeout(() => {
            window.location.href = './docs/';
        }, 3000);
    </script>
</body>
</html>
EOF

echo "🚀 部署到 GitHub Pages..."
cd $TEMP_DIR
git init
git add -A
git commit -m "Deploy docs and playground $(date)"
git branch -M gh-pages
git remote add origin https://github.com/eveningwater/ew-vue-component.git
git push -f origin gh-pages

cd ..
rm -rf $TEMP_DIR

echo "✅ 部署完成！"
echo "📚 文档地址: https://eveningwater.github.io/ew-vue-component/docs/"
echo "🎮 演练场地址: https://eveningwater.github.io/ew-vue-component/playground/"
echo "🏠 主页地址: https://eveningwater.github.io/ew-vue-component/" 