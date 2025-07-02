<template>
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
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">短信通知</span>
          <span class="setting-desc">接收重要短信提醒</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="settings.smsNotifications">
          <span class="slider"></span>
        </label>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>🎨 主题设置</h3>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">主题模式</span>
          <span class="setting-desc">选择你喜欢的主题</span>
        </div>
        <select v-model="settings.theme" class="theme-selector">
          <option value="light">浅色主题</option>
          <option value="dark">深色主题</option>
          <option value="auto">跟随系统</option>
        </select>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">语言设置</span>
          <span class="setting-desc">选择界面语言</span>
        </div>
        <select v-model="settings.language" class="theme-selector">
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>🔒 隐私设置</h3>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">资料公开</span>
          <span class="setting-desc">是否公开个人资料</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="settings.publicProfile">
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-title">数据分析</span>
          <span class="setting-desc">允许收集使用数据用于改进服务</span>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="settings.analytics">
          <span class="slider"></span>
        </label>
      </div>
    </div>
    
    <div class="settings-actions">
      <button class="btn-primary" @click="saveSettings">保存设置</button>
      <button class="btn-secondary" @click="resetSettings">重置为默认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const settings = reactive({
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: true,
  theme: 'light',
  language: 'zh-CN',
  publicProfile: false,
  analytics: true
})

const saveSettings = () => {
  // 模拟保存设置
  console.log('保存的设置:', settings)
  alert('设置已保存！')
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    Object.assign(settings, {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      theme: 'light',
      language: 'zh-CN',
      publicProfile: false,
      analytics: true
    })
    alert('设置已重置为默认值')
  }
}
</script>

<style scoped>
.settings {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.settings-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8em;
}

.settings-header p {
  color: #718096;
  margin: 0;
}

.settings-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.settings-section h3 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.2em;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-title {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.setting-desc {
  display: block;
  font-size: 0.9em;
  color: #718096;
}

/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
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

.slider:before {
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

input:checked + .slider {
  background-color: #42b883;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* 选择器样式 */
.theme-selector {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.9em;
  min-width: 120px;
}

.theme-selector:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover {
  background: #369970;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e1;
}
</style> 