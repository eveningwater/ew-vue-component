<template>
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
      
      <div class="metric-card">
        <div class="metric-icon">📈</div>
        <div class="metric-info">
          <span class="metric-number">{{ formatNumber(metrics.orders) }}</span>
          <span class="metric-label">订单总数</span>
          <span class="metric-change negative">-{{ metrics.orderGrowth }}%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">⭐</div>
        <div class="metric-info">
          <span class="metric-number">{{ metrics.satisfaction }}%</span>
          <span class="metric-label">满意度</span>
          <span class="metric-change positive">+{{ metrics.satisfactionGrowth }}%</span>
        </div>
      </div>
    </div>
    
    <div class="charts-section">
      <div class="chart-container">
        <h3>📊 访问趋势</h3>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div 
              v-for="(value, index) in chartData" 
              :key="index"
              class="chart-bar"
              :style="{ height: value + '%' }"
              :title="`第${index + 1}周: ${value}%`"
            ></div>
          </div>
          <div class="chart-labels">
            <span v-for="i in 12" :key="i">W{{ i }}</span>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>🌍 用户分布</h3>
        <div class="chart-placeholder">
          <div class="pie-chart">
            <div class="pie-slice" v-for="(region, index) in regions" :key="index"
                 :style="{ 
                   '--percentage': region.percentage,
                   '--rotation': getRotation(index),
                   '--color': region.color
                 }">
            </div>
          </div>
          <div class="pie-legend">
            <div v-for="region in regions" :key="region.name" class="legend-item">
              <span class="legend-color" :style="{ backgroundColor: region.color }"></span>
              <span class="legend-text">{{ region.name }} ({{ region.percentage }}%)</span>
            </div>
          </div>
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
</template>

<script setup>
import { ref, reactive } from 'vue'

const metrics = reactive({
  users: 12847,
  userGrowth: 12.5,
  revenue: 856420,
  revenueGrowth: 8.3,
  orders: 3256,
  orderGrowth: 2.1,
  satisfaction: 94.2,
  satisfactionGrowth: 1.8
})

const chartData = ref([
  65, 59, 80, 81, 56, 72, 45, 84, 67, 78, 88, 92
])

const regions = ref([
  { name: '亚洲', percentage: 45, color: '#42b883' },
  { name: '欧洲', percentage: 30, color: '#ff6b6b' },
  { name: '北美', percentage: 20, color: '#4ecdc4' },
  { name: '其他', percentage: 5, color: '#ffe66d' }
])

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
  },
  {
    id: 3,
    type: 'payment',
    emoji: '💳',
    text: '订单 #12340 付款成功，金额：¥1,299',
    time: '8分钟前'
  },
  {
    id: 4,
    type: 'feedback',
    emoji: '⭐',
    text: '用户 "王小红" 给予了5星好评',
    time: '12分钟前'
  },
  {
    id: 5,
    type: 'system',
    emoji: '⚙️',
    text: '系统自动备份已完成',
    time: '15分钟前'
  }
])

const formatNumber = (num) => {
  return num.toLocaleString()
}

const getRotation = (index) => {
  let rotation = 0
  for (let i = 0; i < index; i++) {
    rotation += regions.value[i].percentage * 3.6
  }
  return rotation
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dashboard-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8em;
}

.dashboard-header p {
  color: #718096;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 2.5em;
  margin-right: 1rem;
}

.metric-info {
  flex: 1;
}

.metric-number {
  display: block;
  font-size: 1.8em;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.metric-label {
  display: block;
  color: #718096;
  font-size: 0.9em;
  margin-bottom: 0.25rem;
}

.metric-change {
  font-size: 0.85em;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.metric-change.positive {
  color: #38a169;
  background: #f0fff4;
}

.metric-change.negative {
  color: #e53e3e;
  background: #fed7d7;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  height: 120px;
  gap: 4px;
  margin-bottom: 1rem;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(to top, #42b883, #369970);
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: linear-gradient(to top, #ff6b6b, #e55a5a);
}

.chart-labels {
  display: flex;
  gap: 4px;
}

.chart-labels span {
  width: 20px;
  text-align: center;
  font-size: 0.75em;
  color: #718096;
}

.pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #42b883 0deg 162deg,
    #ff6b6b 162deg 270deg,
    #4ecdc4 270deg 342deg,
    #ffe66d 342deg 360deg
  );
  margin-bottom: 1rem;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  font-size: 0.85em;
  color: #4a5568;
}

.recent-activities {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.recent-activities h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.activity-icon {
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

.activity-icon.user { background: #e6fffa; }
.activity-icon.order { background: #fef5e7; }
.activity-icon.payment { background: #f0fff4; }
.activity-icon.feedback { background: #fffacd; }
.activity-icon.system { background: #f7fafc; }

.activity-content {
  flex: 1;
}

.activity-text {
  display: block;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.85em;
  color: #718096;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 