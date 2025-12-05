<template>
  <section class="feature-section">
    <div class="feature-container">
      <div class="feature-card">
        <FeatureCard
          v-for="(feature, index) in features"
          :key="index"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'clock',
    title: '实时天气',
    description: '提供准确的天气预报服务，支持全球城市查询，智能穿衣推荐，让您随时掌握天气变化。'
  },
  {
    icon: 'building',
    title: '股票行情',
    description: '实时股票数据展示，支持美股和A股查询，丰富的可视化图表，助您把握投资机会。'
  },
  {
    icon: 'trowel',
    title: '地震监测',
    description: '全球地震数据实时更新，详细的地震信息和地理分布，让您了解地球的动态。'
  },
  {
    icon: 'sprout',
    title: '时钟工具',
    description: '精美的数字时钟，支持多种主题模式，白天、黑夜、星空等，满足不同场景需求。'
  }
]
</script>

<style scoped>
.feature-section {
  width: 100%;
  background-color: #1e5a4a;
  padding: 80px 40px;
  position: relative;
}

.feature-container {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: #2d7a6b;
  border-radius: 20px;
  padding: 60px 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .feature-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .feature-section {
    padding: 60px 20px;
  }
  
  .feature-card {
    grid-template-columns: 1fr;
    padding: 40px 30px;
    gap: 30px;
  }
}
</style>

