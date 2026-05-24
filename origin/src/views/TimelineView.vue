<template>
  <div class="timeline-view">
    <!-- Hero Header -->
    <header class="timeline-header">
      <div class="header-content">
        <h1 class="page-title">成长轨迹</h1>
        <p class="page-subtitle">记录每一个重要的里程碑</p>
      </div>
    </header>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-value"><CountUp :end="stat.count" :suffix="stat.suffix" /></div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section">
      <div class="timeline-container">
        <div class="timeline-line"></div>

        <AnimatedItem
          v-for="(event, index) in timelineEvents"
          :key="event.id"
          :type="index % 2 === 1 ? 'fadeLeft' : 'fadeRight'"
          :delay="index * 0.15"
        >
          <div
            class="timeline-item"
            :class="{ 'item-right': index % 2 === 1 }"
          >
            <div class="timeline-dot" :style="{ background: event.color }">
              <span class="dot-icon">{{ event.icon }}</span>
            </div>

            <div class="timeline-card">
              <div class="card-header">
                <span class="event-date">{{ event.date }}</span>
                <span class="event-type" :style="{ background: event.color + '20', color: event.color }">
                  {{ event.type }}
                </span>
              </div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-tags" v-if="event.tags">
                <span class="tag" v-for="tag in event.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="event-links" v-if="event.link">
                <a :href="event.link" target="_blank" class="event-link">查看详情 →</a>
              </div>
            </div>
          </div>
        </AnimatedItem>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnimatedItem from '../components/AnimatedItem.vue'
import CountUp from '../components/CountUp.vue'

const stats = ref([
  { count: 6, suffix: '+', label: '年编程经验' },
  { count: 50, suffix: '+', label: '完成项目' },
  { count: 20, suffix: '+', label: '技术文章' },
  { count: 1000, suffix: '+', label: 'GitHub Stars' }
])

const timelineEvents = ref([
  {
    id: 1,
    date: '2024',
    type: '里程碑',
    title: '个人网站重构',
    description: '使用 Vue 3 + TypeScript 重构个人网站，添加深色模式、相册、时间线等新功能。',
    icon: '🚀',
    color: '#2d7a6b',
    tags: ['Vue 3', 'TypeScript', 'Vite'],
    link: null
  },
  {
    id: 2,
    date: '2023',
    type: '工作',
    title: '晋升高级开发工程师',
    description: '负责核心业务模块的技术架构设计，带领团队完成多个重点项目交付。',
    icon: '💼',
    color: '#8b6f47',
    tags: ['架构设计', '团队管理', '技术分享'],
    link: null
  },
  {
    id: 3,
    date: '2022',
    type: '开源',
    title: '开源项目突破 1000 Stars',
    description: '个人开源项目在 GitHub 获得 1000+ Stars，被多个公司采用于生产环境。',
    icon: '⭐',
    color: '#f59e0b',
    tags: ['开源', '社区贡献'],
    link: 'https://github.com/GrassPillow'
  },
  {
    id: 4,
    date: '2021',
    type: '学习',
    title: '深入学习云原生技术',
    description: '系统学习 Kubernetes、Docker、Service Mesh 等云原生技术栈，并通过相关认证。',
    icon: '☁️',
    color: '#3b82f6',
    tags: ['Kubernetes', 'Docker', '云原生'],
    link: null
  },
  {
    id: 5,
    date: '2020',
    type: '工作',
    title: '加入新团队',
    description: '加入某知名互联网公司，负责电商平台的前端架构和性能优化。',
    icon: '🏢',
    color: '#8b6f47',
    tags: ['电商', '前端架构', '性能优化'],
    link: null
  },
  {
    id: 6,
    date: '2019',
    type: '项目',
    title: '独立完成大型项目',
    description: '独立设计并开发了一套完整的数据可视化平台，支持多种图表类型和实时数据更新。',
    icon: '📊',
    color: '#10b981',
    tags: ['数据可视化', 'ECharts', 'WebSocket'],
    link: null
  },
  {
    id: 7,
    date: '2018',
    type: '学习',
    title: '系统学习后端开发',
    description: '深入学习 Node.js、Python、数据库设计等后端技术，向全栈开发者转型。',
    icon: '📚',
    color: '#3b82f6',
    tags: ['Node.js', 'Python', '全栈'],
    link: null
  },
  {
    id: 8,
    date: '2017',
    type: '里程碑',
    title: '正式入行',
    description: '大学毕业，正式成为一名前端开发工程师，开始了技术之路的探索。',
    icon: '🎓',
    color: '#2d7a6b',
    tags: ['毕业', '入行'],
    link: null
  }
])
</script>

<style scoped>
.timeline-view {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.timeline-header {
  background: var(--gradient-hero);
  padding: 60px 24px;
  text-align: center;
}

/* Stats Section */
.stats-section {
  background: var(--bg-primary);
  padding: 40px 24px;
  border-bottom: 1px solid var(--border-light);
}

.stats-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-secondary);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

/* Timeline Section */
.timeline-section {
  padding: 60px 24px;
}

.timeline-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  justify-content: flex-start;
  padding: 20px 0;
  position: relative;
}

.timeline-item.item-right {
  justify-content: flex-end;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  box-shadow: var(--shadow-md);
  border: 4px solid var(--bg-secondary);
  z-index: 1;
}

.dot-icon {
  font-size: 1.3rem;
}

.timeline-card {
  width: 42%;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-date {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.event-type {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.event-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 16px;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tag:hover {
  background: var(--primary-color);
  color: #fff;
}

.event-links {
  margin-top: 12px;
}

.event-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.event-link:hover {
  color: var(--primary-light);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .timeline-line {
    left: 24px;
  }

  .timeline-item,
  .timeline-item.item-right {
    justify-content: flex-start;
    padding-left: 60px;
  }

  .timeline-dot {
    left: 24px;
    width: 40px;
    height: 40px;
  }

  .dot-icon {
    font-size: 1.1rem;
  }

  .timeline-card {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .timeline-card {
    padding: 16px;
  }

  .event-date {
    font-size: 1.2rem;
  }
}
</style>
