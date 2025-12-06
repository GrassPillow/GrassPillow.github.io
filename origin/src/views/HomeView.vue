<template>
  <div class="home-view">
    <HeroSection />
    <FeatureSection />
    <GridSection />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import FeatureSection from '../components/FeatureSection.vue'
import GridSection from '../components/GridSection.vue'
</script>

<style scoped>
.home-view {
  width: 100%;
  min-height: calc(100vh - 40px);
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 50%, #f5f5f7 100%);
}
</style>

