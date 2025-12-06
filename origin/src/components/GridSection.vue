<template>
  <section class="grid-section">
    <div class="section-header">
      <h2 class="section-title">核心功能</h2>
      <p class="section-subtitle">探索我们提供的实用工具和服务</p>
    </div>
    <div class="grid-container">
      <GridCard
        v-for="(card, index) in gridCards"
        :key="index"
        :title="card.title"
        :description="card.description"
        :icon="card.icon"
        :background-color="card.backgroundColor"
        :icon-color="card.iconColor"
        :image="card.image"
        :style="{ animationDelay: `${index * 0.1}s` }"
      />
    </div>
    <div class="footer-text">© 2025 多功能服务平台</div>
  </section>
</template>

<script setup>
import GridCard from './GridCard.vue'

const gridCards = [
  {
    title: '图书管理',
    description: '精美的图书列表展示，支持分类浏览和搜索',
    icon: 'flower',
    backgroundColor: '#2d7a6b',
    iconColor: 'white'
  },
  {
    title: 'AI工具',
    description: '丰富的AI工具集合，提升工作效率',
    icon: 'leaf',
    backgroundColor: '#5a4a3a',
    iconColor: 'white'
  },
  {
    title: '地震监测',
    description: '全球地震数据实时更新，了解地球的动态变化',
    icon: 'golden-leaf',
    backgroundColor: '#8b6f47',
    iconColor: 'white'
  },
  {
    title: '时钟工具',
    description: '精美的数字时钟，多种主题模式可选',
    icon: 'flower',
    backgroundColor: '#2d7a6b',
    iconColor: 'white'
  }
]
</script>

<style scoped>
.grid-section {
  width: 100%;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);
  padding: 6rem 2rem 5rem;
  position: relative;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 4rem;
  text-align: center;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
}

.grid-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.footer-text {
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  margin-top: 7rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 1024px) {
  .grid-section {
    padding: 5rem 2rem 4rem;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 2.25rem;
  }
  
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }
  
  .footer-text {
    margin-top: 5rem;
    padding-top: 2.5rem;
  }
}

@media (max-width: 768px) {
  .grid-section {
    padding: 4rem 1.5rem 3rem;
  }
  
  .section-header {
    margin-bottom: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-text {
    margin-top: 4rem;
    padding-top: 2rem;
    font-size: 0.8rem;
  }
}
</style>
