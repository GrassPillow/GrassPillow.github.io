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
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 25%, #3a8a7a 50%, #8b6f47 75%, #a67c52 100%);
  min-height: 600px;
  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.hero-background::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 120px 80px;
  max-width: 700px;
  color: white;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0 0 30px 0;
  line-height: 1.1;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 0 0 50px 0;
  color: white;
  opacity: 0.95;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-button {
  display: inline-block;
  background: linear-gradient(135deg, #e8d5c4 0%, #f0e4d4 100%);
  color: #5a4a3a;
  border: none;
  padding: 18px 48px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2),
              0 4px 12px rgba(232, 213, 196, 0.4);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-button::before {
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

.hero-button:hover::before {
  width: 300px;
  height: 300px;
}

.hero-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3),
              0 6px 16px rgba(232, 213, 196, 0.5);
  background: linear-gradient(135deg, #f0e4d4 0%, #f8f0e8 100%);
}

.hero-button:active {
  transform: translateY(-2px) scale(1.02);
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
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: leafFloat 8s ease-in-out infinite;
}

@keyframes leafFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.leaf-1 {
  top: 15%;
  right: 20%;
  background-color: #4a7c59;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(25deg);
  animation-delay: 0s;
}

.leaf-2 {
  top: 30%;
  right: 15%;
  background-color: #6b8e5a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-15deg);
  width: 60px;
  height: 60px;
  animation-delay: 1s;
}

.leaf-3 {
  top: 45%;
  right: 25%;
  background-color: #8b6f47;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(45deg);
  width: 70px;
  height: 70px;
  animation-delay: 2s;
}

.leaf-4 {
  top: 60%;
  right: 10%;
  background-color: #a67c52;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-30deg);
  width: 90px;
  height: 90px;
  animation-delay: 1.5s;
}

.leaf-5 {
  top: 25%;
  right: 5%;
  background-color: #5a8a6b;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(60deg);
  width: 55px;
  height: 55px;
  animation-delay: 0.5s;
}

.leaf-6 {
  top: 50%;
  right: 30%;
  background-color: #7a9a6a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-45deg);
  width: 65px;
  height: 65px;
  animation-delay: 2.5s;
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

