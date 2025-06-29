import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'EwVueComponent',
  description: 'A powerful Vue 3 dynamic component wrapper',
  lang: 'zh-CN',
  base: '/ew-vue-component/docs/',
  
  // 多语言配置
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: 'EwVueComponent',
      description: '强大的 Vue 3 动态组件包装器',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/' },
          { text: 'API', link: '/zh-CN/api/' },
          { text: '示例', link: '/zh-CN/examples/' },
          { text: 'GitHub', link: 'https://github.com/eveningwater/ew-vue-component' }
        ],
        sidebar: {
          '/zh-CN/guide/': [
            {
              text: '指南',
              items: [
                { text: '快速开始', link: '/zh-CN/guide/' },
                { text: '基础用法', link: '/zh-CN/guide/basic-usage' },
                { text: '高级特性', link: '/zh-CN/guide/advanced-features' },
                { text: '最佳实践', link: '/zh-CN/guide/best-practices' }
              ]
            }
          ],
          '/zh-CN/api/': [
            {
              text: 'API 参考',
              items: [
                { text: '组件', link: '/zh-CN/api/component' },
                { text: '插件', link: '/zh-CN/api/plugin' },
                { text: '工具函数', link: '/zh-CN/api/utils' }
              ]
            }
          ],
          '/zh-CN/examples/': [
            {
              text: '示例',
              items: [
                { text: '基础示例', link: '/zh-CN/examples/basic' },
                { text: '动态切换', link: '/zh-CN/examples/dynamic' },
                { text: '错误处理', link: '/zh-CN/examples/error-handling' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'EwVueComponent',
      description: 'A powerful Vue 3 dynamic component wrapper',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/' },
          { text: 'API', link: '/en/api/' },
          { text: 'Examples', link: '/en/examples/' },
          { text: 'GitHub', link: 'https://github.com/eveningwater/ew-vue-component' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/en/guide/' },
                { text: 'Basic Usage', link: '/en/guide/basic-usage' },
                { text: 'Advanced Features', link: '/en/guide/advanced-features' },
                { text: 'Best Practices', link: '/en/guide/best-practices' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'Component', link: '/en/api/component' },
                { text: 'Plugin', link: '/en/api/plugin' },
                { text: 'Utils', link: '/en/api/utils' }
              ]
            }
          ],
          '/en/examples/': [
            {
              text: 'Examples',
              items: [
                { text: 'Basic Examples', link: '/en/examples/basic' },
                { text: 'Dynamic Switching', link: '/en/examples/dynamic' },
                { text: 'Error Handling', link: '/en/examples/error-handling' }
              ]
            }
          ]
        }
      }
    }
  },

  // 主题配置
  themeConfig: {
    logo: '/ew-vue-component/docs/logo.svg',
    siteTitle: 'EwVueComponent',
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eveningwater/ew-vue-component' }
    ],
    
    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 EwVueComponent'
    },
    
    // 搜索
    search: {
      provider: 'local'
    }
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/ew-vue-component/docs/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }]
  ]
}) 