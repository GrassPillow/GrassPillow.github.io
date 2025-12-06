<template>
  <section class="hero-section">
    <div class="hero-background">
      <div class="hero-gradient-1"></div>
      <div class="hero-gradient-2"></div>
      <div class="hero-gradient-3"></div>
    </div>
    <div class="hero-content">
      <div class="hero-badge">多功能服务平台</div>
      <h1 class="hero-title">ORIGIN</h1>
      <p class="hero-description">
        集成了图书管理、AI工具、地震监测、时钟工具等多种实用功能
      </p>
      <div class="hero-buttons">
        <router-link to="/books" class="hero-button primary">开始使用</router-link>
        <router-link to="/about" class="hero-button secondary">了解更多</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  width: 100%;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 10rem;
  position: relative;
  overflow: hidden;
  background: #f5f5f7;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-gradient-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(45, 122, 107, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.hero-gradient-2 {
  position: absolute;
  bottom: -15%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 111, 71, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 25s ease-in-out infinite reverse;
}

.hero-gradient-3 {
  position: absolute;
  top: 50%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(45, 90, 79, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  max-width: 1000px;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
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

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(45, 122, 107, 0.1);
  border: 1px solid rgba(45, 122, 107, 0.2);
  border-radius: 50px;
  color: #2d7a6b;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 50%, #2d5a4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.8;
  margin: 0 0 3rem 0;
  color: #555;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-button {
  display: inline-block;
  padding: 1.125rem 2.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-decoration: none;
  border: 2px solid transparent;
  letter-spacing: 0.01em;
}

.hero-button.primary {
  background: linear-gradient(135deg, #2d7a6b 0%, #1e5a4a 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(45, 122, 107, 0.3);
}

.hero-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.4);
  background: linear-gradient(135deg, #1e5a4a 0%, #2d7a6b 100%);
}

.hero-button.secondary {
  background: white;
  color: #2d7a6b;
  border-color: rgba(45, 122, 107, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.hero-button.secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
}

.hero-button:active {
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .hero-section {
    min-height: 80vh;
    padding: 6rem 2rem 8rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 75vh;
    padding: 5rem 1.5rem 6rem;
  }
  
  .hero-title {
    font-size: 2.75rem;
    margin-bottom: 1.25rem;
  }
  
  .hero-description {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .hero-button {
    width: 100%;
    padding: 1rem 2rem;
  }
  
  .hero-badge {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
    margin-bottom: 1.5rem;
  }
}
</style>
