<template>
  <div>
    <div class="nav-container" :class="{ 'nav-hidden': isNavHidden }">
        <router-link to="/earthquake">地震</router-link>｜
        <router-link to="/clock">时钟</router-link>｜
        <router-link to="/map">地图</router-link>｜
        <router-link to="/about">关于</router-link>
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
  justify-content: center;
  padding: 10px 20px;
  margin: 10px auto;
  max-width: 800px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
  font-weight: 500;
  position: sticky;
  top: 10px;
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.05);
  width: fit-content;
}

.nav-hidden {
  transform: translateY(-120%);
  opacity: 0;
  pointer-events: none;
}

/* 导航栏样式 - 苹果风格 */
.router-link {
  color: #1d1d1f;
  text-decoration: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.router-link:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
</style>
