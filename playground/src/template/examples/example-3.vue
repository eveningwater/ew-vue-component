<template>
    <div class="demo">
        <div class="controls">
            <button @click="loadUserProfile">加载用户资料</button>
            <button @click="loadSettings">加载设置</button>
            <button @click="loadDashboard">加载仪表板</button>
        </div>
        <div v-if="loading" class="loading">
            加载中...
        </div>
        <div v-else-if="!currentAsyncComponent" class="placeholder">
            <div class="placeholder-icon">📦</div>
            <p>请选择一个组件来开始异步加载演示</p>
        </div>
        <EwVueComponent v-else :is="markRaw(currentAsyncComponent)" @error="handleError" />
    </div>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent, reactive } from 'vue'
import { EwVueComponent } from 'ew-vue-component'

const currentAsyncComponent = ref(null)
const loading = ref(false)

// 通用的异步组件创建函数
const createAsyncComponent = (componentName, delay = 300) => {
  return defineAsyncComponent({
    loader: async () => {
      // 模拟组件解析时间
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // 解析组件并返回组件定义
      return await parseVueComponent(componentName)
    },
    loadingComponent: {
      template: `<div class="async-loading">正在加载${componentName}组件...</div>`
    },
    errorComponent: {
      template: '<div class="async-error">组件加载失败</div>'
    },
    delay: 200,
    timeout: 10000
  })
}

// 解析Vue组件的函数 - 模拟从components目录加载
const parseVueComponent = async (componentName) => {
  // 在真实项目中，这里会使用 (componentName) => import('./components/Dashboard.vue') 动态导入
  // 在演练场中，我们模拟从components目录加载组件,演练场环境与真实环境有所差异,所以这里使用模拟的方式来加载组件
  
  const componentMap = {
    'UserProfile': {
      name: 'UserProfile',
      template: `
        <div class="user-profile">
          <div class="profile-header">
            <div class="avatar">
              <img :src="user.avatar" :alt="user.name" />
            </div>
            <div class="user-info">
              <h2>{{ user.name }}</h2>
              <p class="title">{{ user.title }}</p>
              <p class="email">{{ user.email }}</p>
            </div>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-number">{{ user.stats.projects }}</span>
              <span class="stat-label">项目</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.stats.followers }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.stats.following }}</span>
              <span class="stat-label">关注中</span>
            </div>
          </div>
          
          <div class="profile-bio">
            <h3>个人简介</h3>
            <p>{{ user.bio }}</p>
          </div>
          
          <div class="profile-actions">
            <button class="btn-primary" @click="editProfile">编辑资料</button>
            <button class="btn-secondary" @click="viewActivity">查看动态</button>
          </div>
        </div>
      `,
      setup() {
        const user = ref({
          name: '张三',
          title: '前端开发工程师',
          email: 'zhangsan@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
          bio: '热爱编程，专注于Vue.js和现代前端技术栈。拥有5年以上的前端开发经验，喜欢分享技术心得，持续学习新技术。',
          stats: {
            projects: 42,
            followers: 1205,
            following: 387
          }
        })

        const editProfile = () => {
          alert('跳转到编辑资料页面')
        }

        const viewActivity = () => {
          alert('查看用户活动记录')
        }

        return { user, editProfile, viewActivity }
      }
    },
    'Settings': {
      name: 'Settings',
      template: `
        <div class="settings">
          <div class="settings-header">
            <h2>⚙️ 系统设置</h2>
            <p>管理你的偏好设置和应用配置</p>
          </div>
          
          <div class="settings-section">
            <h3>🔔 通知设置</h3>
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-title">邮件通知</span>
                <span class="setting-desc">接收重要邮件通知</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.emailNotifications">
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-title">推送通知</span>
                <span class="setting-desc">接收浏览器推送通知</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.pushNotifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="settings-actions">
            <button class="btn-primary" @click="saveSettings">保存设置</button>
            <button class="btn-secondary" @click="resetSettings">重置为默认</button>
          </div>
        </div>
      `,
      setup() {
        const settings = reactive({
          emailNotifications: true,
          pushNotifications: false
        })

        const saveSettings = () => {
          alert('设置已保存！')
        }

        const resetSettings = () => {
          if (confirm('确定要重置所有设置为默认值吗？')) {
            Object.assign(settings, {
              emailNotifications: true,
              pushNotifications: false
            })
            alert('设置已重置为默认值')
          }
        }

        return { settings, saveSettings, resetSettings }
      }
    },
    'Dashboard': {
      name: 'Dashboard',
      template: `
        <div class="dashboard">
          <div class="dashboard-header">
            <h2>📊 数据仪表板</h2>
            <p>实时监控关键业务指标</p>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">👥</div>
              <div class="metric-info">
                <span class="metric-number">{{ formatNumber(metrics.users) }}</span>
                <span class="metric-label">总用户数</span>
                <span class="metric-change positive">+{{ metrics.userGrowth }}%</span>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">💰</div>
              <div class="metric-info">
                <span class="metric-number">¥{{ formatNumber(metrics.revenue) }}</span>
                <span class="metric-label">月度收入</span>
                <span class="metric-change positive">+{{ metrics.revenueGrowth }}%</span>
              </div>
            </div>
          </div>
          
          <div class="recent-activities">
            <h3>📝 最近活动</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">{{ activity.emoji }}</div>
                <div class="activity-content">
                  <span class="activity-text">{{ activity.text }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      setup() {
        const metrics = reactive({
          users: 12847,
          userGrowth: 12.5,
          revenue: 856420,
          revenueGrowth: 8.3
        })

        const recentActivities = ref([
          {
            id: 1,
            type: 'user',
            emoji: '👤',
            text: '新用户 "李小明" 注册了账户',
            time: '2分钟前'
          },
          {
            id: 2,
            type: 'order',
            emoji: '🛒',
            text: '收到来自上海的新订单 #12345',
            time: '5分钟前'
          }
        ])

        const formatNumber = (num) => {
          return num.toLocaleString()
        }

        return { metrics, recentActivities, formatNumber }
      }
    }
  }
  
  return markRaw(componentMap[componentName] || { 
    template: '<div>组件未找到</div>' 
  })
}

// 异步加载函数 - 使用统一的createAsyncComponent
const loadUserProfile = async () => {
    loading.value = true
    try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 创建异步组件 - 模拟从./components/UserProfile.vue加载
        currentAsyncComponent.value = createAsyncComponent('UserProfile', 300)
    } catch (error) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

const loadSettings = async () => {
    loading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 800))
        // 模拟从./components/Settings.vue加载
        currentAsyncComponent.value = createAsyncComponent('Settings', 250)
    } catch (error) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

const loadDashboard = async () => {
    loading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1200))
        // 模拟从./components/Dashboard.vue加载
        currentAsyncComponent.value = createAsyncComponent('Dashboard', 400)
    } catch (error) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

const handleError = (error) => {
    console.error('异步组件加载失败:', error)
    loading.value = false
}
</script>

<style>
/* 导入组件样式 */
@import url('https://unpkg.com/ew-vue-component@0.0.2-beta.7/dist/ew-vue-component.css');
</style>

<style scoped>
.demo {
    padding: 2rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
}

.controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
}

.controls button {
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    background: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.controls button:hover {
    background: #f8fafc;
}

.loading {
    padding: 2rem;
    text-align: center;
    color: #64748b;
    font-style: italic;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.placeholder {
    padding: 3rem 2rem;
    text-align: center;
    color: #64748b;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 0.75rem;
    margin-top: 1rem;
}

.placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
}

.placeholder p {
    margin: 0;
    font-size: 1.1rem;
}

.async-loading {
    padding: 1rem;
    text-align: center;
    color: #42b883;
    font-style: italic;
}

.async-error {
    padding: 1rem;
    text-align: center;
    color: #e53e3e;
    background: #fed7d7;
    border-radius: 0.25rem;
}

/* 全局样式支持异步组件 */
:global(.user-profile) {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:global(.profile-header) {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

:global(.avatar) {
  margin-right: 1.5rem;
}

:global(.avatar img) {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b883;
}

:global(.user-info h2) {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5em;
}

:global(.title) {
  color: #42b883;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

:global(.email) {
  color: #718096;
  margin: 0;
}

:global(.profile-stats) {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

:global(.stat-item) {
  text-align: center;
}

:global(.stat-number) {
  display: block;
  font-size: 2em;
  font-weight: bold;
  color: #42b883;
}

:global(.stat-label) {
  color: #718096;
  font-size: 0.9em;
}

:global(.profile-bio) {
  margin-bottom: 2rem;
}

:global(.profile-bio h3) {
  color: #2d3748;
  margin: 0 0 1rem 0;
}

:global(.profile-bio p) {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

:global(.profile-actions) {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

:global(.btn-primary), :global(.btn-secondary) {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

:global(.btn-primary) {
  background: #42b883;
  color: white;
}

:global(.btn-primary:hover) {
  background: #369970;
}

:global(.btn-secondary) {
  background: #e2e8f0;
  color: #4a5568;
}

:global(.btn-secondary:hover) {
  background: #cbd5e1;
}

/* 设置页面样式 */
:global(.settings) {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:global(.settings-header) {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

:global(.settings-header h2) {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8em;
}

:global(.settings-header p) {
  color: #718096;
  margin: 0;
}

:global(.settings-section) {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

:global(.settings-section h3) {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.2em;
}

:global(.setting-item) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

:global(.setting-item:last-child) {
  border-bottom: none;
}

:global(.setting-info) {
  flex: 1;
}

:global(.setting-title) {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

:global(.setting-desc) {
  display: block;
  font-size: 0.9em;
  color: #718096;
}

:global(.switch) {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

:global(.switch input) {
  opacity: 0;
  width: 0;
  height: 0;
}

:global(.slider) {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

:global(.slider:before) {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

:global(input:checked + .slider) {
  background-color: #42b883;
}

:global(input:checked + .slider:before) {
  transform: translateX(26px);
}

:global(.settings-actions) {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* 仪表板样式 */
:global(.dashboard) {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:global(.dashboard-header) {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

:global(.dashboard-header h2) {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8em;
}

:global(.dashboard-header p) {
  color: #718096;
  margin: 0;
}

:global(.metrics-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

:global(.metric-card) {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease;
}

:global(.metric-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:global(.metric-icon) {
  font-size: 2.5em;
  margin-right: 1rem;
}

:global(.metric-info) {
  flex: 1;
}

:global(.metric-number) {
  display: block;
  font-size: 1.8em;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

:global(.metric-label) {
  display: block;
  color: #718096;
  font-size: 0.9em;
  margin-bottom: 0.25rem;
}

:global(.metric-change) {
  font-size: 0.85em;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

:global(.metric-change.positive) {
  color: #38a169;
  background: #f0fff4;
}

:global(.recent-activities) {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

:global(.recent-activities h3) {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

:global(.activity-list) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:global(.activity-item) {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

:global(.activity-icon) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2em;
  background: #e2e8f0;
}

:global(.activity-icon.user) { 
  background: #e6fffa; 
}

:global(.activity-icon.order) { 
  background: #fef5e7; 
}

:global(.activity-content) {
  flex: 1;
}

:global(.activity-text) {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

:global(.activity-time) {
  font-size: 0.85em;
  color: #718096;
}
</style>