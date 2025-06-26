import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h('div', { class: 'hero-decoration' }),
      'home-hero-after': () => h('div', { class: 'hero-features' })
    })
  },
  enhanceApp({ app }) {
    // 注册全局组件
  }
} 