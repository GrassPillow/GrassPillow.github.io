<template>
  <router-link :to="cardLink" class="grid-card" :style="{ backgroundColor: backgroundColor }">
    <div class="card-content">
      <div v-if="icon" class="card-icon-wrapper">
        <div class="card-icon" :class="`card-icon-${icon}`" :style="{ color: iconColor }"></div>
      </div>
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <p v-if="description" class="card-description">{{ description }}</p>
    </div>
  </router-link>
</template>

<script setup>
/* eslint-disable no-undef */
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})

const cardLink = computed(() => {
  const linkMap = {
    '图书管理': '/books',
    'AI工具': '/ai',
    '地震监测': '/earthquake',
    '时钟工具': '/clock'
  }
  return linkMap[props.title] || '/'
})
</script>

<style scoped>
.grid-card {
  border-radius: 20px;
  padding: 3.5rem 2.5rem;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: none;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.grid-card:hover::before {
  opacity: 1;
}

.grid-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

.card-icon-wrapper {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-icon-wrapper::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  transform: scale(0.8);
}

.grid-card:hover .card-icon-wrapper::after {
  opacity: 1;
  transform: scale(1);
}

.card-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-card:hover .card-icon {
  transform: scale(1.15) rotate(5deg);
}

.card-icon-flower {
  width: 48px;
  height: 48px;
  background: currentColor;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0.95;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-icon-leaf {
  width: 40px;
  height: 40px;
  background: currentColor;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
  opacity: 0.95;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-icon-golden-leaf {
  width: 40px;
  height: 40px;
  background: currentColor;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
  opacity: 0.95;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.01em;
  line-height: 1.3;
  transition: transform 0.3s ease;
}

.grid-card:hover .card-title {
  transform: translateY(-2px);
}

.card-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  margin: 0;
  color: white;
  opacity: 0.92;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  max-width: 100%;
}

@media (max-width: 768px) {
  .grid-card {
    padding: 3rem 2rem;
    min-height: 240px;
    border-radius: 16px;
  }
  
  .card-icon-wrapper {
    margin-bottom: 1.5rem;
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
  }
  
  .card-icon-flower {
    width: 44px;
    height: 44px;
  }
  
  .card-icon-leaf,
  .card-icon-golden-leaf {
    width: 36px;
    height: 36px;
  }
  
  .card-title {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }
  
  .card-description {
    font-size: 0.875rem;
  }
}
</style>
