<template>
  <section class="feature-section">
    <div class="feature-container">
      <FeatureCard
        v-for="(feature, index) in features"
        :key="index"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'trowel',
    title: '地震监测',
    description: '全球地震数据实时更新，详细的地震信息和地理分布'
  },
  {
    icon: 'sprout',
    title: '时钟工具',
    description: '精美的数字时钟，支持多种主题模式'
  },
  {
    icon: 'building',
    title: 'AI工具',
    description: '丰富的AI工具集合，提升您的工作效率'
  },
  {
    icon: 'clock',
    title: '图书管理',
    description: '精美的图书列表展示，支持分类浏览和搜索'
  }
]
</script>

<style scoped>
.feature-section {
  width: 100%;
  background: #ffffff;
  padding: 5rem 2rem;
}

.feature-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
}

@media (max-width: 1024px) {
  .feature-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .feature-section {
    padding: 3rem 1.5rem;
  }
  
  .feature-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
