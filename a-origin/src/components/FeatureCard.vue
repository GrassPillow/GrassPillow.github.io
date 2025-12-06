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
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 60px;
  height: 60px;
  border: 2px solid white;
  border-radius: 50%;
  position: relative;
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
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  color: white;
  opacity: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>

