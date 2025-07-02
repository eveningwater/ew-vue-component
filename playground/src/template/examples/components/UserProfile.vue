<template>
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
</template>

<script setup>
import { ref } from 'vue'

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
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.avatar {
  margin-right: 1.5rem;
}

.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b883;
}

.user-info h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5em;
}

.title {
  color: #42b883;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.email {
  color: #718096;
  margin: 0;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2em;
  font-weight: bold;
  color: #42b883;
}

.stat-label {
  color: #718096;
  font-size: 0.9em;
}

.profile-bio {
  margin-bottom: 2rem;
}

.profile-bio h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.profile-bio p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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