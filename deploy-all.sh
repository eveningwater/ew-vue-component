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
    <title>EwVueComponent - 强大的 Vue 3 动态组件库</title>
    <meta name="description" content="一个强大而灵活的 Vue 3 组件包装器，支持安全的动态组件渲染、全面的错误处理、性能优化和插件系统。">
    <meta name="keywords" content="Vue, Vue3, 组件, 动态组件, JavaScript, TypeScript">
    <meta property="og:title" content="EwVueComponent - 强大的 Vue 3 动态组件库">
    <meta property="og:description" content="一个强大而灵活的 Vue 3 组件包装器，支持安全的动态组件渲染、全面的错误处理、性能优化和插件系统。">
    <meta property="og:type" content="website">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧩</text></svg>">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            padding: 60px 0;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .tagline {
            font-size: 1.3rem;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .main-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 60px;
        }
        
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            border: 2px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 1.1rem;
            backdrop-filter: blur(10px);
        }
        
        .btn:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.6);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .btn.primary {
            background: #42b883;
            border-color: #42b883;
        }
        
        .btn.primary:hover {
            background: #369870;
            border-color: #369870;
        }
        
        .features {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 60px 40px;
            margin: 0 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: #2c3e50;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .feature {
            text-align: center;
            padding: 30px 20px;
            border-radius: 15px;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .feature p {
            color: #666;
            line-height: 1.6;
        }
        
        .quick-start {
            background: #2c3e50;
            color: white;
            padding: 60px 0;
            margin-top: 80px;
        }
        
        .quick-start h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 40px;
        }
        
        .code-block {
            background: #34495e;
            border-radius: 12px;
            padding: 30px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 1rem;
            line-height: 1.5;
            overflow-x: auto;
            margin: 20px 0;
            position: relative;
        }
        
        .code-block::before {
            content: "npm install ew-vue-component";
            position: absolute;
            top: 10px;
            right: 15px;
            background: #42b883;
            color: white;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
        }
        
        footer {
            text-align: center;
            padding: 40px 0;
            color: rgba(255,255,255,0.8);
        }
        
        .footer-links {
            display: flex;
            gap: 30px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: white;
        }
        
        @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            .tagline { font-size: 1.1rem; }
            .logo { font-size: 3rem; }
            .features { margin: 0 10px; padding: 40px 20px; }
            .feature { padding: 20px 15px; }
            .main-links { flex-direction: column; align-items: center; }
            .btn { width: 250px; text-align: center; }
        }
        
        .badge {
            display: inline-block;
            margin: 0 5px;
        }
        
        .badges {
            text-align: center;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">🧩</div>
            <h1>EwVueComponent</h1>
            <p class="tagline">
                一个强大而灵活的 Vue 3 组件包装器，支持安全的动态组件渲染、全面的错误处理、性能优化和插件系统
            </p>
            
            <div class="badges">
                <img src="https://badge.fury.io/js/ew-vue-component.svg" alt="npm version" class="badge">
                <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" class="badge">
                <img src="https://img.shields.io/badge/Vue-3.x-brightgreen.svg" alt="Vue 3" class="badge">
                <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" class="badge">
            </div>
            
            <div class="main-links">
                <a href="./playground/" class="btn primary">🎮 在线演练场</a>
                <a href="./docs/" class="btn">📚 查看文档</a>
                <a href="https://github.com/eveningwater/ew-vue-component" class="btn">💻 GitHub</a>
                <a href="https://www.npmjs.com/package/ew-vue-component" class="btn">📦 NPM</a>
            </div>
        </div>
    </header>

    <main>
        <div class="container">
            <section class="features">
                <h2>🚀 主要特性</h2>
                <div class="features-grid">
                    <div class="feature">
                        <div class="feature-icon">🔄</div>
                        <h3>动态组件渲染</h3>
                        <p>无缝渲染字符串、Vue 组件、异步组件和组件对象，支持完整的生命周期和状态管理</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">🛡️</div>
                        <h3>错误边界</h3>
                        <p>内置错误处理机制，自动回退到默认插槽，确保应用稳定性和用户体验</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h3>性能优化</h3>
                        <p>组件缓存、懒加载和性能监控，确保最佳的运行时性能</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">🔌</div>
                        <h3>插件系统</h3>
                        <p>可扩展架构，内置日志、性能和错误处理插件，支持自定义插件开发</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">📦</div>
                        <h3>TypeScript 支持</h3>
                        <p>完整的 TypeScript 支持和类型定义，提供出色的开发体验</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">🚫</div>
                        <h3>零依赖</h3>
                        <p>轻量级设计，无外部依赖，可以安全地集成到任何 Vue 3 项目中</p>
                    </div>
                </div>
            </section>
        </div>
        
        <section class="quick-start">
            <div class="container">
                <h2>🎯 快速开始</h2>
                <div class="code-block">
                    <pre><code>// 安装
npm install ew-vue-component

// 使用
import { EwVueComponent } from 'ew-vue-component'

// 在模板中
&lt;EwVueComponent :is="MyComponent" :title="title" /&gt;</code></pre>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-links">
                <a href="./docs/">文档</a>
                <a href="./playground/">演练场</a>
                <a href="https://github.com/eveningwater/ew-vue-component">GitHub</a>
                <a href="https://www.npmjs.com/package/ew-vue-component">NPM</a>
                <a href="https://github.com/eveningwater/ew-vue-component/issues">报告问题</a>
            </div>
            <p>&copy; 2024 EwVueComponent. 基于 MIT 许可证开源。</p>
        </div>
    </footer>

    <script>
        // 简单的交互效果
        document.addEventListener('DOMContentLoaded', function() {
            // 为特性卡片添加入场动画
            const features = document.querySelectorAll('.feature');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            features.forEach((feature) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(30px)';
                feature.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(feature);
            });
        });
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