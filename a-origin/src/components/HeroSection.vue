<template>
  <section class="hero-section">
    <div class="hero-background">
      <div class="hero-content">
        <h1 class="hero-title">多功能服务平台</h1>
        <p class="hero-description">
          集成了图书管理、AI工具、地震监测、时钟工具等多种实用功能，为您提供便捷的在线服务体验。界面简洁美观，操作流畅，随时随地满足您的需求。
        </p>
        <router-link to="/books" class="hero-button">开始使用</router-link>
      </div>
      <div class="leaves-decoration">
        <div class="leaf leaf-1"></div>
        <div class="leaf leaf-2"></div>
        <div class="leaf leaf-3"></div>
        <div class="leaf leaf-4"></div>
        <div class="leaf leaf-5"></div>
        <div class="leaf leaf-6"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  width: 100%;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  margin-top: 0;
}

.hero-background {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #2d7a6b 0%, #2d7a6b 50%, #8b6f47 50%, #8b6f47 100%);
  min-height: 600px;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 120px 80px;
  max-width: 600px;
  color: white;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 30px 0;
  line-height: 1.2;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 40px 0;
  color: white;
  opacity: 0.95;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.hero-button {
  display: inline-block;
  background-color: #e8d5c4;
  color: #5a4a3a;
  border: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-decoration: none;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background-color: #f0e4d4;
}

.leaves-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}

.leaf {
  position: absolute;
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.leaf-1 {
  top: 15%;
  right: 20%;
  background-color: #4a7c59;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(25deg);
}

.leaf-2 {
  top: 30%;
  right: 15%;
  background-color: #6b8e5a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-15deg);
  width: 60px;
  height: 60px;
}

.leaf-3 {
  top: 45%;
  right: 25%;
  background-color: #8b6f47;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(45deg);
  width: 70px;
  height: 70px;
}

.leaf-4 {
  top: 60%;
  right: 10%;
  background-color: #a67c52;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-30deg);
  width: 90px;
  height: 90px;
}

.leaf-5 {
  top: 25%;
  right: 5%;
  background-color: #5a8a6b;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(60deg);
  width: 55px;
  height: 55px;
}

.leaf-6 {
  top: 50%;
  right: 30%;
  background-color: #7a9a6a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-45deg);
  width: 65px;
  height: 65px;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 80px 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
}
</style>

