<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <PageTransition mode="out-in" :duration="{ enter: 300, leave: 300 }">
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
      <button
        type="button"
        class="ball-button"
        aria-label="打开导航菜单"
        :aria-expanded="isExpanded"
        @click="toggleNav"
        :class="{ 'active': isExpanded }"
      >
        <span class="ball-icon" aria-hidden="true">{{ isExpanded ? '✕' : '☰' }}</span>
      </button>

      <!-- 展开的导航菜单 -->
      <div class="nav-menu" v-show="isExpanded" @keyup.esc="isExpanded = false">
        <router-link to="/" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🏠</span>
          <span class="nav-label">首页</span>
        </router-link>
        <router-link to="/resources/website" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🌐</span>
          <span class="nav-label">网站工具</span>
        </router-link>
        <router-link to="/resources/software" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">💻</span>
          <span class="nav-label">软件应用</span>
        </router-link>
        <router-link to="/resources/learning" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">📚</span>
          <span class="nav-label">学习资料</span>
        </router-link>
        <router-link to="/resources/media" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🎬</span>
          <span class="nav-label">影视音乐</span>
        </router-link>
        <router-link to="/resources/all" class="nav-item" @click="handleNavClick">
          <span class="nav-icon">🗂️</span>
          <span class="nav-label">全部资源</span>
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
  // passive: 滚动监听不阻止默认行为，避免影响滚动性能
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})
</script>

<style>
:root {
  /* 品牌与基础色 */
  --c-primary: #2d7a6b;
  --c-primary-light: #e8f5f1;
  --c-primary-dark: #1e5a4a;

  /* 背景层级 */
  --c-bg-page: #faf9f7;
  --c-bg-card: #ffffff;
  --c-bg-warm: #f5f3ef;
  --c-border: #e8e4df;

  /* 文字层级 */
  --c-text: #2c3e2d;
  --c-text-secondary: #637266;
  --c-text-muted: #68766a;
  /* 深色背景（页头、悬浮球、激活按钮）上的文字 */
  --c-text-inverse: #ffffff;

  /* 浮层背景：悬浮导航菜单等。深浅主题下均为深色系，
     因此配 --c-overlay-text（浮层上的文字），两套主题取值一致 */
  --c-overlay: #1e5a4a;
  --c-overlay-text: #ffffff;
  /* 透明通道用 RGB 分量形式，便于 rgba(var(--c-x-rgb), 0.5) 组合
     --c-overlay-text-rgb：浮层/悬浮球表面的半透明白色高光与激活底色 */
  --c-overlay-text-rgb: 255, 255, 255;
  /* --c-shadow-rgb：阴影用的纯黑分量，阴影在两套主题下均为黑色 */
  --c-shadow-rgb: 0, 0, 0;

  /* 语义色：base 用于左边框与图标，text 用于文字
     取值经 WCAG 对比度校验：text 类 >= 4.5:1 on --c-bg-card，
     base 类 >= 3:1（非文本 UI，WCAG 1.4.11） */
  --c-success-base: #2d7a6b;
  --c-success-text: #2d5a4f;
  --c-error-base: #dc3545;
  --c-error-text: #c62f3f;
  --c-warning-base: #b88700;
  --c-warning-text: #856404;
  --c-info-base: #17a2b8;
  --c-info-text: #0c5460;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(var(--c-shadow-rgb), 0.04);
  --shadow-md: 0 4px 16px rgba(var(--c-shadow-rgb), 0.06);
  --shadow-lg: 0 8px 32px rgba(var(--c-shadow-rgb), 0.08);
  /* 彩色投影用的主色，主题切换时随之变化 */
  --c-primary-rgb: 45, 122, 107;

  /* 圆角 */
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Z-index scale */
  --z-base: 0;
  --z-toast: 500;
}

/* 深色模式调色板（绿 + 暖灰体系反色）
   每个 :root 中定义的 token 都必须在此给出深色取值 */
[data-theme="dark"] {
  --c-primary: #55b3a0;
  --c-primary-light: #1c3530;
  --c-primary-dark: #8fd4c6;

  --c-bg-page: #101513;
  --c-bg-card: #1b2421;
  --c-bg-warm: #222c29;
  --c-border: #33423c;

  --c-text: #e2e8e6;
  --c-text-secondary: #a3b3ad;
  --c-text-muted: #85958e;
  /* 深色主题下页头背景转为浅色系，文字相应转为深色 */
  --c-text-inverse: #101513;

  --c-overlay: #1c3530;
  --c-overlay-text: #ffffff;
  --c-overlay-text-rgb: 255, 255, 255;
  --c-shadow-rgb: 0, 0, 0;

  /* 语义色仅提亮明度，保持原色相家族（红/黄/蓝/绿） */
  --c-success-base: #55b3a0;
  --c-success-text: #7fd4c1;
  --c-error-base: #ff7b7b;
  --c-error-text: #ff9a9a;
  --c-warning-base: #ffc107;
  --c-warning-text: #ffd166;
  --c-info-base: #4dd0e1;
  --c-info-text: #7ddcea;

  --shadow-sm: 0 1px 3px rgba(var(--c-shadow-rgb), 0.35);
  --shadow-md: 0 4px 16px rgba(var(--c-shadow-rgb), 0.4);
  --shadow-lg: 0 8px 32px rgba(var(--c-shadow-rgb), 0.45);
  --c-primary-rgb: 85, 179, 160;
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
  color: var(--c-text-inverse);
  margin: 0 0 12px;
  text-shadow: 0 4px 20px rgba(var(--c-shadow-rgb), 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--c-text-inverse);
  opacity: 0.85;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}

body {
  background: var(--c-bg-page);
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

/* 主题切换过渡
   仅对颜色属性生效：卡片、列表容器、筛选标签、Toast、导航项、按钮等
   元素在 data-theme 变化时平滑渐变，而不是瞬时跳变。
   刻意不含 transform，避免与各元素自身的 hover 位移动效叠加。
   App.vue 末尾的 prefers-reduced-motion 规则会把这些过渡压缩到接近 0。 */
.resource-card,
.category-section,
.search-filter-bar,
.stats-bar,
.stat-item,
.empty-state,
.load-error,
.filter-tag,
.category-count,
.category-header,
.load-error-btn,
.hero-search,
.search-input,
.featured-card,
.category-card,
.toast,
.nav-item,
.theme-toggle,
.back-to-top {
  transition-property: color, background-color, border-color, box-shadow, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
p {
  text-wrap: pretty;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 悬浮球导航 */
.floating-nav-ball {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: var(--z-toast);
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  background: var(--c-primary);
  border: 3px solid rgba(var(--c-overlay-text-rgb), 0.4);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: var(--z-toast);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 12px 32px rgba(var(--c-primary-rgb), 0.5),
                0 6px 16px rgba(var(--c-primary-rgb), 0.4),
                inset 0 2px 4px rgba(var(--c-overlay-text-rgb), 0.3),
                inset 0 -2px 4px rgba(var(--c-shadow-rgb), 0.2);
  }
  50% {
    box-shadow: 0 16px 40px rgba(var(--c-primary-rgb), 0.6),
                0 8px 20px rgba(var(--c-primary-rgb), 0.5),
                inset 0 2px 4px rgba(var(--c-overlay-text-rgb), 0.4),
                inset 0 -2px 4px rgba(var(--c-shadow-rgb), 0.2);
  }
}

.ball-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(var(--c-overlay-text-rgb), 0.3);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.ball-button:hover::before {
  transform: translate(-50%, -50%) scale(1);
}

.ball-button:hover {
  transform: scale(1.15);
  box-shadow: 0 16px 40px rgba(var(--c-primary-rgb), 0.6),
              0 8px 20px rgba(var(--c-primary-rgb), 0.5),
              inset 0 2px 4px rgba(var(--c-overlay-text-rgb), 0.4),
              inset 0 -2px 4px rgba(var(--c-shadow-rgb), 0.2);
  border-color: rgba(var(--c-overlay-text-rgb), 0.6);
}

.ball-button.active {
  transform: rotate(90deg) scale(1.15);
  background: var(--c-primary-dark);
  animation: none;
}

.ball-icon {
  color: var(--c-overlay-text);
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
  /* 浮层始终为深色系：mix(--c-overlay) 与 97% 不透明度，主题切换时取深浅两套浮层色 */
  background: color-mix(in srgb, var(--c-overlay) 97%, transparent);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(var(--c-primary-rgb), 0.5),
              0 10px 30px rgba(var(--c-primary-rgb), 0.4),
              inset 0 2px 4px rgba(var(--c-overlay-text-rgb), 0.3),
              inset 0 -2px 4px rgba(var(--c-shadow-rgb), 0.2);
  border: 2px solid rgba(var(--c-overlay-text-rgb), 0.25);
  min-width: 150px;
  animation: slideUp 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  color: var(--c-overlay-text);
  text-decoration: none;
  border-radius: 18px;
  transition: all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  background: rgba(var(--c-overlay-text-rgb), 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item:hover {
  transform: translateX(-4px);
  color: var(--c-overlay-text);
}

.nav-item.router-link-active {
  background: rgba(var(--c-overlay-text-rgb), 0.3);
  color: var(--c-overlay-text);
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(var(--c-shadow-rgb), 0.25),
              inset 0 2px 4px rgba(var(--c-overlay-text-rgb), 0.4),
              inset 0 -1px 2px rgba(var(--c-shadow-rgb), 0.1);
  border: 1px solid rgba(var(--c-overlay-text-rgb), 0.2);
}

.nav-icon {
  font-size: 1.4rem;
  line-height: 1;
  position: relative;
  z-index: var(--z-base);
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

.nav-label {
  font-size: 0.95rem;
  position: relative;
  z-index: var(--z-base);
  font-weight: 500;
  transition: transform 0.15s ease;
}

.nav-item:hover .nav-label {
  transform: translateX(2px);
}

/* .nav-container::before/after removed - no corresponding .nav-container element */

.nav-hidden {
  transform: translateY(-140%);
  opacity: 0;
  pointer-events: none;
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

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
