<template>
  <transition name="fade">
    <button
      v-if="isVisible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <span class="back-to-top-icon">↑</span>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
let scrollTimeout = null

const handleScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  scrollTimeout = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    isVisible.value = scrollTop > 300
  }, 100)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3),
              0 2px 6px rgba(139, 111, 71, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 20px rgba(45, 122, 107, 0.4),
              0 4px 12px rgba(139, 111, 71, 0.3);
}

.back-to-top:active {
  transform: translateY(-2px) scale(1.05);
}

.back-to-top-icon {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 90px;
    right: 20px;
    width: 44px;
    height: 44px;
  }
  
  .back-to-top-icon {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .back-to-top {
    bottom: 80px;
    right: 15px;
    width: 40px;
    height: 40px;
  }
  
  .back-to-top-icon {
    font-size: 1.2rem;
  }
}
</style>

