<template>
  <section class="grid-section">
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
      />
    </div>
    <div class="footer-text">© 2025 多功能服务平台 - 为您提供便捷的在线服务</div>
  </section>
</template>

<script setup>
import GridCard from './GridCard.vue'

const gridCards = [
  {
    title: '天气预报',
    description: '实时天气信息，智能穿衣推荐，支持全球城市查询，为您的生活出行提供便利。',
    icon: 'flower',
    backgroundColor: '#2d7a6b',
    iconColor: 'white'
  },
  {
    title: '股票市场',
    description: '实时股票行情，数据可视化展示，支持美股和A股，助您做出明智的投资决策。',
    icon: 'leaf',
    backgroundColor: '#5a4a3a',
    iconColor: 'white'
  },
  {
    title: '地震监测',
    description: '全球地震数据实时更新，详细的地震信息和地理分布，了解地球的动态变化。',
    icon: 'golden-leaf',
    backgroundColor: '#c9a882',
    iconColor: '#d4a574'
  },
  {
    title: '',
    description: '',
    icon: '',
    backgroundColor: '#2d7a6b',
    iconColor: '',
    image: 'forest'
  },
  {
    title: '时钟工具',
    description: '精美的数字时钟，多种主题模式可选，白天、黑夜、星空等，满足不同场景需求。',
    icon: 'flower',
    backgroundColor: '#5a4a3a',
    iconColor: 'white'
  },
  {
    title: '地图服务',
    description: '交互式地图展示，支持多种地图功能，为您提供便捷的地理信息服务。',
    icon: 'hexagon',
    backgroundColor: '#c9a882',
    iconColor: '#5a4a3a'
  }
]
</script>

<style scoped>
.grid-section {
  width: 100%;
  background-color: #1e5a4a;
  padding: 80px 40px 40px;
  position: relative;
}

.grid-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.footer-text {
  text-align: center;
  color: white;
  font-size: 0.9rem;
  margin-top: 60px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-section {
    padding: 60px 20px 30px;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>

