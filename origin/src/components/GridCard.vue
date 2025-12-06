<template>
  <div class="grid-card" :style="{ backgroundColor: backgroundColor }">
    <div v-if="image === 'forest'" class="card-image forest-image"></div>
    <div v-else class="card-content">
      <div v-if="icon" class="card-icon-wrapper">
        <div class="card-icon" :class="`card-icon-${icon}`" :style="{ color: iconColor }"></div>
      </div>
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <p v-if="description" class="card-description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
defineProps({
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
</script>

<style scoped>
.grid-card {
  border-radius: 24px;
  padding: 50px 35px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25),
              0 4px 12px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.grid-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.grid-card:hover::before {
  opacity: 1;
}

.grid-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35),
              0 8px 16px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.card-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.forest-image {
  background: linear-gradient(135deg, 
    rgba(139, 195, 74, 0.3) 0%,
    rgba(76, 175, 80, 0.4) 50%,
    rgba(56, 142, 60, 0.5) 100%
  ),
  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23FFD700;stop-opacity:0.6"/><stop offset="100%" style="stop-color:%23FFA500;stop-opacity:0.3"/></linearGradient></defs><rect width="400" height="300" fill="%234CAF50"/><path d="M 200 0 L 180 80 L 220 80 Z" fill="url(%23sun)"/><path d="M 200 0 L 160 100 L 240 100 Z" fill="url(%23sun)"/><path d="M 200 0 L 140 120 L 260 120 Z" fill="url(%23sun)"/><rect x="0" y="200" width="400" height="100" fill="%2366BB6A"/><circle cx="100" cy="150" r="40" fill="%232E7D32"/><circle cx="300" cy="140" r="50" fill="%232E7D32"/><circle cx="200" cy="130" r="45" fill="%232E7D32"/></svg>');
  background-size: cover;
  background-position: center;
  position: relative;
}

.forest-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.card-icon-wrapper {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.grid-card:hover .card-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.card-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-icon-flower {
  width: 60px;
  height: 60px;
  background: currentColor;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon-leaf {
  width: 50px;
  height: 50px;
  background: currentColor;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.card-icon-leaf::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
}

.card-icon-golden-leaf {
  width: 50px;
  height: 50px;
  background: currentColor;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon-hexagon {
  width: 50px;
  height: 50px;
  background: currentColor;
  clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.card-icon-hexagon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 0 rgba(255, 255, 255, 0.5), 0 -8px 0 rgba(255, 255, 255, 0.5);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.grid-card:hover .card-title {
  transform: translateY(-2px);
}

.card-description {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  color: white;
  opacity: 0.95;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 1;
}

.grid-card:hover .card-description {
  opacity: 1;
}
</style>

