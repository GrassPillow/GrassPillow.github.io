<template>
  <div>
    <div class="nav-container" :class="{ 'nav-hidden': isNavHidden }">
        <router-link to="/" class="nav-link">
          <span class="nav-text">首页</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/books" class="nav-link">
          <span class="nav-text">图书</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/weather" class="nav-link">
          <span class="nav-text">天气</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/stock" class="nav-link">
          <span class="nav-text">股票</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/earthquake" class="nav-link">
          <span class="nav-text">地震</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/clock" class="nav-link">
          <span class="nav-text">时钟</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/map" class="nav-link">
          <span class="nav-text">地图</span>
        </router-link>
        <span class="nav-divider"></span>
        <router-link to="/about" class="nav-link">
          <span class="nav-text">关于</span>
        </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isNavHidden: false,
      lastScrollTop: 0,
      scrollTimeout: null
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },
  methods: {
    handleScroll() {
      // 防抖处理
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
      
      this.scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        // 当向下滚动超过50px且滚动距离大于上次位置时，隐藏导航栏
        if (scrollTop > 50 && scrollTop > this.lastScrollTop) {
          this.isNavHidden = true
        } else {
          this.isNavHidden = false
        }
        
        this.lastScrollTop = scrollTop
      }, 50)
    }
  }
};
</script>

<style>
body {
  background-color: #f5f5f7;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin: 0;
  width: 100%;
  border-radius: 0;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.15) 0%, 
    rgba(45, 122, 107, 0.1) 50%, 
    rgba(139, 111, 71, 0.1) 50%, 
    rgba(139, 111, 71, 0.15) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 8px 32px rgba(45, 122, 107, 0.15), 
              0 2px 8px rgba(139, 111, 71, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(30, 90, 74, 0.1);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), 
              opacity 0.4s ease,
              box-shadow 0.3s ease,
              background 0.3s ease;
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 1000;
  border: none;
  border-bottom: 1px solid rgba(45, 122, 107, 0.2);
  gap: 6px;
  overflow: hidden;
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

/* 导航链接样式 */
.nav-link {
  color: #2d5a4f;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 16px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.25) 0%, 
    rgba(45, 122, 107, 0.15) 50%,
    rgba(139, 111, 71, 0.15) 50%,
    rgba(139, 111, 71, 0.25) 100%);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-radius: 16px;
  transform: scale(0.95);
}

.nav-link:hover::before {
  opacity: 1;
  transform: scale(1);
}

.nav-link:hover {
  transform: translateY(-2px);
  color: #1e5a4a;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.3) 0%, 
    rgba(45, 122, 107, 0.2) 50%,
    rgba(139, 111, 71, 0.2) 50%,
    rgba(139, 111, 71, 0.3) 100%);
  color: #1e5a4a;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(45, 122, 107, 0.3);
}

.nav-link.router-link-active::before {
  opacity: 0;
}

.nav-text {
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.nav-link:hover .nav-text {
  transform: scale(1.05);
}

/* 分隔符样式 */
.nav-divider {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(45, 122, 107, 0.3) 20%, 
    rgba(139, 111, 71, 0.3) 50%,
    rgba(45, 122, 107, 0.3) 80%, 
    transparent 100%);
  margin: 0 4px;
  opacity: 0.6;
  position: relative;
  z-index: 1;
}

.nav-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: rgba(45, 122, 107, 0.4);
  border-radius: 50%;
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

/* 主页、图书列表页、天气页和股票页特殊样式 - 全屏显示 */
.router-view .home-view,
.router-view .book-list-view,
.router-view .weather-view,
.router-view .stock-view {
  margin: -20px;
  padding: 0;
}
</style>
