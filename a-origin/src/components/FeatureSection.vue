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
    title: 'Exetgar is',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
  },
  {
    icon: 'building',
    title: 'Nartomersi',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'
  },
  {
    icon: 'trowel',
    title: 'Cleotewes',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  {
    icon: 'sprout',
    title: 'Weohe sloasarcion',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.'
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

