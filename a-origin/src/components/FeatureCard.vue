<template>
  <div class="feature-card-item">
    <div class="icon-wrapper">
      <div class="icon" :class="`icon-${icon}`"></div>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.feature-card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  padding: 30px 20px;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  cursor: pointer;
}

.feature-card-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card-item:hover::before {
  opacity: 1;
}

.feature-card-item:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.05);
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.feature-card-item:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.icon {
  width: 70px;
  height: 70px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
}

.feature-card-item:hover .icon {
  border-color: white;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.icon-clock::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
}

.icon-clock::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 8px;
  background: white;
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(45deg);
}

.icon-building {
  border-radius: 8px;
}

.icon-building::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border: 2px solid white;
  border-radius: 4px;
}

.icon-building::after {
  content: '';
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 20px;
  border: 2px solid white;
  border-radius: 4px;
}

.icon-trowel::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 25px;
  height: 2px;
  background: white;
  border-radius: 2px;
}

.icon-trowel::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 0;
  height: 0;
  border-left: 8px solid white;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  margin-left: 12px;
}

.icon-sprout::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 20px solid white;
}

.icon-sprout::after {
  content: '';
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 15px;
  background: white;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.feature-card-item:hover .feature-title {
  transform: translateY(-2px);
}

.feature-description {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  color: white;
  opacity: 0.95;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: relative;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.feature-card-item:hover .feature-description {
  opacity: 1;
}
</style>

