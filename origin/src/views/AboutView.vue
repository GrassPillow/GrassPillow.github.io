<template>
  <div class="about-view">
    <div class="about-hero">
      <div class="hero-content">
        <h1 class="about-title">关于我们</h1>
        <p class="about-subtitle">多功能服务平台 - 为您提供便捷的在线服务体验</p>
      </div>
      <div class="leaves-decoration">
        <div class="leaf leaf-1"></div>
        <div class="leaf leaf-2"></div>
        <div class="leaf leaf-3"></div>
      </div>
    </div>
    
    <div class="about-content">
      <div class="content-section">
        <div class="section-card">
          <div class="card-icon">
            <div class="icon-book"></div>
          </div>
          <h2 class="section-title">我们的使命</h2>
          <p class="section-text">
            致力于打造一个多功能服务平台，整合图书管理、AI工具、地震监测、时钟工具等实用功能。
            我们相信技术能够改变生活，工具能够提升效率。
          </p>
        </div>
        
        <div class="section-card">
          <div class="card-icon">
            <div class="icon-leaf"></div>
          </div>
          <h2 class="section-title">功能丰富</h2>
          <p class="section-text">
            平台集成了多种实用工具，从图书管理到AI工具，从地震监测到时钟工具，
            满足您在不同场景下的需求，提供一站式的服务体验。
          </p>
        </div>
        
        <div class="section-card">
          <div class="card-icon">
            <div class="icon-light"></div>
          </div>
          <h2 class="section-title">简洁高效</h2>
          <p class="section-text">
            我们注重用户体验，界面简洁美观，操作流畅直观。
            让每一个功能都能快速上手，让每一次使用都成为愉快的体验。
          </p>
        </div>
      </div>
      
      <div class="features-section">
        <h2 class="features-title">平台特色</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-number">01</div>
            <h3 class="feature-name">图书管理</h3>
            <p class="feature-desc">精美的图书列表展示，支持分类浏览和搜索，发现阅读的乐趣</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">02</div>
            <h3 class="feature-name">AI工具</h3>
            <p class="feature-desc">丰富的AI工具集合，包括文本处理、代码格式化、密码生成等</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">03</div>
            <h3 class="feature-name">地震监测</h3>
            <p class="feature-desc">全球地震数据实时更新，详细的地震信息和地理分布展示</p>
          </div>
          <div class="feature-item">
            <div class="feature-number">04</div>
            <h3 class="feature-name">时钟工具</h3>
            <p class="feature-desc">精美的数字时钟，支持多种主题模式，满足不同场景需求</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-view {
  width: 100%;
  min-height: calc(100vh - 60px);
  background: linear-gradient(180deg, 
    #f5f5f7 0%, 
    rgba(45, 122, 107, 0.05) 30%,
    rgba(139, 111, 71, 0.05) 70%,
    #f5f5f7 100%);
}

.about-hero {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.15) 0%, 
    rgba(45, 122, 107, 0.1) 50%,
    rgba(139, 111, 71, 0.1) 50%,
    rgba(139, 111, 71, 0.15) 100%);
  padding: 100px 20px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.about-title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.about-subtitle {
  font-size: 1.3rem;
  color: #2d5a4f;
  margin: 0;
  opacity: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
  opacity: 0.3;
}

.leaf-1 {
  top: 10%;
  right: 10%;
  width: 60px;
  height: 60px;
  background-color: #4a7c59;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(25deg);
}

.leaf-2 {
  top: 30%;
  left: 10%;
  width: 50px;
  height: 50px;
  background-color: #8b6f47;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(-15deg);
}

.leaf-3 {
  bottom: 20%;
  right: 20%;
  width: 70px;
  height: 70px;
  background-color: #6b8e5a;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(45deg);
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 80px;
}

.content-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.section-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.section-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.2),
              0 4px 12px rgba(139, 111, 71, 0.15);
}

.card-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.15) 0%, 
    rgba(139, 111, 71, 0.15) 100%);
  border-radius: 50%;
}

.icon-book,
.icon-leaf,
.icon-light {
  width: 40px;
  height: 40px;
  position: relative;
}

.icon-book::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 40px;
  background: #2d7a6b;
  border-radius: 2px 4px 4px 2px;
  box-shadow: 2px 0 0 rgba(0, 0, 0, 0.1);
}

.icon-book::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 5px;
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  box-shadow: 0 5px 0 rgba(255, 255, 255, 0.8),
              0 10px 0 rgba(255, 255, 255, 0.8),
              0 15px 0 rgba(255, 255, 255, 0.8);
}

.icon-leaf {
  background: #2d7a6b;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border-radius: 50% 0;
}

.icon-light {
  background: #8b6f47;
  clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
}

.icon-light::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #1e5a4a;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.section-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #2d5a4f;
  margin: 0;
  text-align: center;
  opacity: 0.85;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.features-section {
  margin-top: 60px;
}

.features-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 50px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-item {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 16px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(45, 122, 107, 0.15);
}

.feature-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.feature-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.feature-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2d5a4f;
  margin: 0;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2.5rem;
  }
  
  .about-subtitle {
    font-size: 1.1rem;
  }
  
  .about-hero {
    padding: 60px 20px 50px;
  }
  
  .content-section {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 60px;
  }
  
  .features-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .about-content {
    padding: 40px 15px 60px;
  }
}
</style>
