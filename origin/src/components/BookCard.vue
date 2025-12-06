<template>
  <div class="book-card" :style="{ '--cover-color': coverColor }">
    <div class="book-cover">
      <div class="cover-pattern"></div>
      <div class="cover-title">{{ title }}</div>
    </div>
    <div class="book-info">
      <div class="book-category">{{ category }}</div>
      <h3 class="book-name">{{ title }}</h3>
      <p class="book-author">作者：{{ author }}</p>
      <p class="book-desc">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
defineProps({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverColor: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.book-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.2),
              0 4px 12px rgba(139, 111, 71, 0.15);
}

.book-cover {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, 
    var(--cover-color) 0%, 
    var(--cover-color) 50%,
    rgba(139, 111, 71, 0.8) 50%,
    rgba(139, 111, 71, 0.8) 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0.6;
}

.cover-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.05) 10px,
      rgba(255, 255, 255, 0.05) 20px
    );
}

.cover-title {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  padding: 0 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.3;
}

.book-info {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-category {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.15) 0%, 
    rgba(139, 111, 71, 0.15) 100%);
  color: #2d7a6b;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
  width: fit-content;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.book-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.3;
}

.book-author {
  font-size: 0.9rem;
  color: #5a4a3a;
  margin: 0 0 12px 0;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.book-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2d5a4f;
  margin: 0;
  opacity: 0.85;
  flex: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 768px) {
  .book-cover {
    height: 180px;
  }
  
  .cover-title {
    font-size: 1.5rem;
  }
  
  .book-info {
    padding: 20px;
  }
}
</style>

