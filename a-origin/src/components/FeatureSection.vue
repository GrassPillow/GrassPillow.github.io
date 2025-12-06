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
    icon: 'trowel',
    title: '地震监测',
    description: '全球地震数据实时更新，详细的地震信息和地理分布，让您了解地球的动态。'
  },
  {
    icon: 'sprout',
    title: '时钟工具',
    description: '精美的数字时钟，支持多种主题模式，白天、黑夜、星空等，满足不同场景需求。'
  },
  {
    icon: 'building',
    title: 'AI工具',
    description: '丰富的AI工具集合，包括文本处理、代码格式化、密码生成等，提升您的工作效率。'
  },
  {
    icon: 'clock',
    title: '图书管理',
    description: '精美的图书列表展示，支持分类浏览和搜索，发现阅读的乐趣。'
  }
]
</script>

<style scoped>
.feature-section {
  width: 100%;
  background: linear-gradient(180deg, #1e5a4a 0%, #2d7a6b 50%, #1e5a4a 100%);
  padding: 100px 40px;
  position: relative;
  overflow: hidden;
}

.feature-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.feature-container {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.95) 0%, rgba(45, 122, 107, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  padding: 70px 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
              0 8px 24px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
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

