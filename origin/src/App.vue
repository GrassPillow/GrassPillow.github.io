<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <PageTransition mode="out-in">
        <component :is="Component" :key="route.path" />
      </PageTransition>
    </router-view>
    <!-- Toast 提示组件 -->
    <Toast />
    <!-- 回到顶部按钮 -->
    <BackToTop />
    <!-- 主题切换按钮 -->
    <div class="theme-toggle-container">
      <ThemeToggle />
    </div>
    <!-- 悬浮球导航 -->
    <div class="floating-nav-ball" :class="{ 'nav-hidden': isNavHidden, 'nav-expanded': isExpanded }">
      <!-- 主悬浮球按钮 -->
      <button class="ball-button" @click="toggleNav" :class="{ 'active': isExpanded }">
        <span class="ball-icon">{{ isExpanded ? '✕' : '☰' }}</span>
      </button>
      
      <!-- 展开的导航菜单 -->
      <div class="nav-menu" v-show="isExpanded">
        <router-link to="/" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">首页</span>
        </router-link>
        <router-link to="/about" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">👋</span>
          <span class="nav-label">关于</span>
        </router-link>
        <router-link to="/projects" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">💼</span>
          <span class="nav-label">作品</span>
        </router-link>
        <router-link to="/blog" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">📝</span>
          <span class="nav-label">博客</span>
        </router-link>
        <router-link to="/gallery" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🖼️</span>
          <span class="nav-label">相册</span>
        </router-link>
        <router-link to="/timeline" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">📅</span>
          <span class="nav-label">时间线</span>
        </router-link>
        <router-link to="/todo" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">✅</span>
          <span class="nav-label">待办</span>
        </router-link>
        <router-link to="/music" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🎵</span>
          <span class="nav-label">音乐</span>
        </router-link>
        <router-link to="/tools" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🛠️</span>
          <span class="nav-label">工具</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Toast from './components/Toast.vue'
import BackToTop from './components/BackToTop.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import PageTransition from './components/PageTransition.vue'

const isNavHidden = ref(false)
const isExpanded = ref(false)
const lastScrollTop = ref(0)
const scrollTimeout = ref(null)

const handleScroll = () => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  scrollTimeout.value = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100 && scrollTop > lastScrollTop.value) {
      isNavHidden.value = true
    } else {
      isNavHidden.value = false
    }

    lastScrollTop.value = scrollTop
  }, 50)
}

const toggleNav = () => {
  isExpanded.value = !isExpanded.value
}

const handleNavClick = () => {
  isExpanded.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})
</script>

<style>
/* CSS Variables for Theming */
:root {
  /* Colors - Light Theme */
  --primary-color: #2d7a6b;
  --primary-light: #3a8a7a;
  --primary-dark: #1e5a4a;
  --accent-color: #8b6f47;
  --accent-light: #a68a5a;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f0f4f2;
  --card-bg: #ffffff;

  /* Text Colors */
  --text-primary: #1a1a1a;
  --text-secondary: #5a6a5f;
  --text-muted: #888;

  /* Border Colors */
  --border-color: rgba(45, 122, 107, 0.15);
  --border-light: rgba(45, 122, 107, 0.08);

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.12);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  --gradient-hero: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 40%, #8b6f47 100%);
}

/* Dark Theme */
[data-theme="dark"] {
  --primary-color: #3a8a7a;
  --primary-light: #4a9a8a;
  --primary-dark: #2d7a6b;
  --accent-color: #a68a5a;
  --accent-light: #c9a86a;

  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #242424;
  --card-bg: #1e1e1e;

  --text-primary: #f0f0f0;
  --text-secondary: #b0b0b0;
  --text-muted: #666;

  --border-color: rgba(58, 138, 122, 0.25);
  --border-light: rgba(58, 138, 122, 0.12);

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.45);

  --gradient-primary: linear-gradient(135deg, #3a8a7a 0%, #a68a5a 100%);
  --gradient-hero: linear-gradient(135deg, #0f2e28 0%, #1a4a40 40%, #4a3a25 100%);
}

/* Theme toggle container */
.theme-toggle-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

/* Shared page header typography */
.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}

body {
  background: var(--bg-secondary);
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 悬浮球导航 */
.floating-nav-ball {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.floating-nav-ball.nav-hidden {
  transform: translateY(calc(100vh + 100px));
  opacity: 0;
  pointer-events: none;
}

/* 主悬浮球按钮 */
  .ball-button {
    width: 64px;
    height: 64px;
    min-width: 44px;
    min-height: 44px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1002;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 12px 32px rgba(45, 122, 107, 0.5),
                0 6px 16px rgba(139, 111, 71, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 16px 40px rgba(45, 122, 107, 0.6),
                0 8px 20px rgba(139, 111, 71, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.4),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  }
}

.ball-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.ball-button:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.8);
  outline-offset: 3px;
}

@media (hover: hover) {
  .ball-button:hover::before {
    width: 100px;
    height: 100px;
  }

  .ball-button:hover {
    transform: scale(1.15);
    box-shadow: 0 16px 40px rgba(45, 122, 107, 0.6),
                0 8px 20px rgba(139, 111, 71, 0.5),
                inset 0 2px 4px rgba(255, 255, 255, 0.4),
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
  }
}

.ball-button.active {
  transform: rotate(90deg) scale(1.15);
  background: linear-gradient(135deg, #1e5a4a 0%, #2d7a6b 50%, #6b5537 100%);
  animation: none;
}

.ball-icon {
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
  transition: transform 0.3s ease;
}

/* 展开的导航菜单 */
.nav-menu {
  position: absolute;
  bottom: 88px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.98) 0%, 
    rgba(45, 122, 107, 0.96) 30%,
    rgba(45, 122, 107, 0.95) 50%, 
    rgba(139, 111, 71, 0.95) 50%,
    rgba(139, 111, 71, 0.96) 70%,
    rgba(139, 111, 71, 0.98) 100%);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(45, 122, 107, 0.5),
              0 10px 30px rgba(139, 111, 71, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.25);
  min-width: 150px;
  animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: bottom right;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    min-height: 44px;
  color: white;
  text-decoration: none;
  border-radius: 18px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item:hover {
  transform: translateX(-4px);
  color: white;
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-icon {
  font-size: 1.4rem;
  line-height: 1;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

.nav-label {
  font-size: 0.95rem;
  position: relative;
  z-index: 1;
  font-weight: 500;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-label {
  transform: translateX(2px);
}

.nav-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(45, 122, 107, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.nav-container::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -20%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(139, 111, 71, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.nav-hidden {
  transform: translateY(-140%);
  opacity: 0;
  pointer-events: none;
}


/* 内容区域 */
.router-view {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 主页、图书列表页和AI页特殊样式 - 全屏显示 */
.router-view .home-view,
.router-view .book-list-view,
.router-view .ai-view {
  margin: -20px;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-nav-ball {
    bottom: 20px;
    right: 20px;
  }

  .ball-button {
    width: 56px;
    height: 56px;
  }

  .ball-icon {
    font-size: 1.3rem;
  }

  .nav-menu {
    bottom: 70px;
    padding: 12px;
    min-width: 120px;
    gap: 8px;
  }

  .nav-item {
    padding: 10px 12px;
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  .nav-label {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .floating-nav-ball {
    bottom: 15px;
    right: 15px;
  }

  .ball-button {
    width: 52px;
    height: 52px;
  }

  .ball-icon {
    font-size: 1.2rem;
  }

  .nav-menu {
    bottom: 65px;
    padding: 10px;
    min-width: 110px;
    gap: 6px;
  }

  .nav-item {
    padding: 8px 10px;
  }

  .nav-icon {
    font-size: 1.1rem;
  }

  .nav-label {
    font-size: 0.8rem;
  }
}

</style>
