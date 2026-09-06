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
        <router-link to="/timeline" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">📅</span>
          <span class="nav-label">时间线</span>
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
/* CSS Variables for Theming - Apple Minimal */
:root {
  /* Brand accents (kept as minimal accent) */
  --primary-color: #2d7a6b;
  --primary-light: #3a8a7a;
  --primary-dark: #1e5a4a;
  --accent-color: #8b6f47;
  --accent-light: #a68a5a;

  /* Apple-style gray scale */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f7;
  --bg-tertiary: #e8e8ed;
  --card-bg: #ffffff;

  /* Text */
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-muted: #86868b;
  --text-on-accent: #ffffff;

  /* Page headers */
  --page-title-color: #1d1d1f;
  --page-subtitle-color: #6e6e73;
  --page-header-bg: #f5f5f7;

  /* Glass surfaces (floating nav etc.) */
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-ink: #1d1d1f;
  --glass-hover: rgba(0, 0, 0, 0.06);

  /* Hairline borders & shadows */
  --border-color: rgba(0, 0, 0, 0.12);
  --border-light: rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 6px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.12);

  /* Gradients (soft & neutral) */
  --gradient-primary: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  --gradient-hero: linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%);
}

/* Dark Theme */
[data-theme="dark"] {
  --primary-color: #3a8a7a;
  --primary-light: #4a9a8a;
  --primary-dark: #2d7a6b;
  --accent-color: #a68a5a;
  --accent-light: #c9a86a;

  --bg-primary: #000000;
  --bg-secondary: #101012;
  --bg-tertiary: #1c1c1e;
  --card-bg: #151516;

  --text-primary: #f5f5f7;
  --text-secondary: #a1a1a6;
  --text-muted: #86868b;
  --text-on-accent: #ffffff;

  --page-title-color: #f5f5f7;
  --page-subtitle-color: #a1a1a6;
  --page-header-bg: #101012;

  --glass-bg: rgba(30, 30, 32, 0.72);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-ink: #f5f5f7;
  --glass-hover: rgba(255, 255, 255, 0.12);

  --border-color: rgba(255, 255, 255, 0.18);
  --border-light: rgba(255, 255, 255, 0.1);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.6);

  --gradient-primary: linear-gradient(135deg, #3a8a7a 0%, #a68a5a 100%);
  --gradient-hero: linear-gradient(180deg, #101012 0%, #1c1c1e 100%);
}

/* Base typography - Apple style system font */
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: var(--text-primary);
  background: var(--bg-primary);
}

body {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

/* Theme toggle container */
.theme-toggle-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

/* Shared page header typography (Apple minimal - token driven) */
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--page-title-color);
  margin: 0 0 10px;
  line-height: 1.15;
}

.page-subtitle {
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--page-subtitle-color);
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

/* 主悬浮球按钮（磨砂极简） */
.ball-button {
  width: 60px;
  height: 60px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--glass-ink);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1002;
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
}

.ball-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
}

@media (hover: hover) {
  .ball-button:hover {
    transform: scale(1.06);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }
}

.ball-button.active {
  transform: rotate(45deg) scale(1.02);
  background: var(--glass-bg);
  border-color: var(--primary-color);
}

.ball-icon {
  color: var(--glass-ink);
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 1;
  transition: transform 0.3s ease;
}

/* 展开的导航菜单（磨砂面板） */
.nav-menu {
  position: absolute;
  bottom: 84px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: var(--glass-bg);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 22px;
  box-shadow: var(--shadow-lg);
  min-width: 168px;
  animation: slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: bottom right;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  min-height: 42px;
  color: var(--glass-ink);
  text-decoration: none;
  border-radius: 14px;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: var(--glass-hover);
}

.nav-item.router-link-active {
  background: var(--glass-hover);
  color: var(--primary-color);
  font-weight: 600;
  border: 1px solid var(--glass-border);
}

.nav-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 500;
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
  background-color: var(--bg-primary);
  border-radius: 12px;
  margin: 20px;
  box-shadow: none;
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
