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
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 48px;
  height: 48px;
  border: 2px solid #2d7a6b;
  border-radius: 50%;
  position: relative;
}

.icon-clock::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border: 2px solid #2d7a6b;
  border-radius: 50%;
}

.icon-clock::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 6px;
  background: #2d7a6b;
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(45deg);
}

.icon-building {
  border-radius: 6px;
}

.icon-building::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border: 2px solid #2d7a6b;
  border-radius: 3px;
}

.icon-building::after {
  content: '';
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 16px;
  border: 2px solid #2d7a6b;
  border-radius: 3px;
}

.icon-trowel::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 20px;
  height: 2px;
  background: #2d7a6b;
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
  border-left: 6px solid #2d7a6b;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  margin-left: 10px;
}

.icon-sprout::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 16px solid #2d7a6b;
}

.icon-sprout::after {
  content: '';
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 12px;
  background: #2d7a6b;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>
