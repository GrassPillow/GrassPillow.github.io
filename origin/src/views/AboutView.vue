<template>
  <div class="about-view">
    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-background">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      <div class="hero-content">
        <div class="profile-avatar">
          <div class="avatar-ring"></div>
          <img src="https://picsum.photos/seed/grasspillow/200/200.jpg" alt="GrassPillow" class="avatar-image" />
        </div>
        <h1 class="hero-title">GrassPillow</h1>
        <p class="hero-tagline">全栈开发者 | 技术爱好者 | 终身学习者</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">10+</span>
            <span class="stat-label">项目经验</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">5+</span>
            <span class="stat-label">技术栈</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">∞</span>
            <span class="stat-label">学习热情</span>
          </div>
        </div>
      </div>
    </header>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">关于我</span>
          <h2 class="section-title">你好，我是 GrassPillow</h2>
          <p class="section-subtitle">一名热爱技术的开发者，专注于构建优雅、高效的Web应用</p>
        </div>
        
        <div class="about-intro">
          <div class="intro-card">
            <div class="intro-icon">👋</div>
            <h3>我的故事</h3>
            <p>
              我是一名热衷于技术创新的开发者，拥有丰富的全栈开发经验。
              从 Vue.js 到 Node.js，从数据库设计到 API 开发，我享受技术带来的每一个挑战。
              这个博客是我记录成长、分享知识的小天地。
            </p>
          </div>
          <div class="intro-card">
            <div class="intro-icon">🎯</div>
            <h3>我的目标</h3>
            <p>
              致力于打造高质量的开源项目和技术内容，帮助更多开发者提升技能。
              我相信代码不仅是工具，更是表达创意和解决问题的艺术。
            </p>
          </div>
          <div class="intro-card">
            <div class="intro-icon">💡</div>
            <h3>我的理念</h3>
            <p>
              技术应该服务于人，而非束缚于人。简洁的设计、清晰的代码、
              良好的用户体验，是我追求的每一个项目的标准。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">技术能力</span>
          <h2 class="section-title">专业技能</h2>
        </div>
        
        <div class="skills-grid">
          <div class="skill-category">
            <h3 class="category-title">
              <span class="category-icon">🎨</span>
              前端开发
            </h3>
            <div class="skill-tags">
              <span class="skill-tag">Vue.js</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">TypeScript</span>
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">HTML5/CSS3</span>
              <span class="skill-tag">Tailwind CSS</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3 class="category-title">
              <span class="category-icon">⚙️</span>
              后端开发
            </h3>
            <div class="skill-tags">
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">Express</span>
              <span class="skill-tag">Python</span>
              <span class="skill-tag">RESTful API</span>
              <span class="skill-tag">GraphQL</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3 class="category-title">
              <span class="category-icon">🗄️</span>
              数据库
            </h3>
            <div class="skill-tags">
              <span class="skill-tag">MySQL</span>
              <span class="skill-tag">MongoDB</span>
              <span class="skill-tag">PostgreSQL</span>
              <span class="skill-tag">Redis</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3 class="category-title">
              <span class="category-icon">🛠️</span>
              开发工具
            </h3>
            <div class="skill-tags">
              <span class="skill-tag">Git</span>
              <span class="skill-tag">Docker</span>
              <span class="skill-tag">VS Code</span>
              <span class="skill-tag">Linux</span>
              <span class="skill-tag">CI/CD</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">平台特色</span>
          <h2 class="section-title">博客功能</h2>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-card">
          <h2 class="contact-title">联系我</h2>
          <p class="contact-subtitle">有有趣的想法或合作机会？欢迎与我交流！</p>
          
          <div class="contact-links">
            <a href="mailto:contact@grasspillow.com" class="contact-link">
              <span class="link-icon">📧</span>
              <span class="link-text">发送邮件</span>
            </a>
            <a href="https://github.com/GrassPillow" target="_blank" class="contact-link">
              <span class="link-icon">💻</span>
              <span class="link-text">GitHub</span>
            </a>
            <a href="#" class="contact-link">
              <span class="link-icon">📝</span>
              <span class="link-text">技术博客</span>
            </a>
          </div>
          
          <div class="tech-stack">
            <span class="tech-label">本站技术栈</span>
            <div class="tech-badges">
              <span class="tech-badge">Vue 3</span>
              <span class="tech-badge">TypeScript</span>
              <span class="tech-badge">Vue Router</span>
              <span class="tech-badge">Ant Design Vue</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="page-footer">
      <p>© 2024 GrassPillow. 用心构建，用爱分享。</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  {
    id: 1,
    icon: '📚',
    title: '图书管理',
    description: '精美的图书列表展示，支持分类浏览和搜索，发现阅读的乐趣'
  },
  {
    id: 2,
    icon: '🤖',
    title: 'AI工具集',
    description: '丰富的AI工具集合，包括文本处理、代码格式化、密码生成等'
  },
  {
    id: 3,
    icon: '🌍',
    title: '地震监测',
    description: '全球地震数据实时更新，详细的地震信息和地理分布展示'
  },
  {
    id: 4,
    icon: '🕐',
    title: '时钟工具',
    description: '精美的数字时钟，支持多种主题模式，满足不同场景需求'
  },
  {
    id: 5,
    icon: '🎨',
    title: '3D展示',
    description: '使用Three.js构建的3D产品展示，沉浸式视觉体验'
  },
  {
    id: 6,
    icon: '📝',
    title: '技术博客',
    description: '记录技术学习、项目经验和生活感悟，与读者共同成长'
  }
])
</script>

<style scoped>
.about-view {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 40%, #8b6f47 100%);
  padding: 100px 24px 80px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  left: -60px;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(5deg); }
  50% { transform: translate(-10px, 20px) rotate(-5deg); }
  75% { transform: translate(30px, 10px) rotate(3deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.profile-avatar {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 30px;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%);
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-tagline {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 24px 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* Section Styles */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  color: #2d7a6b;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e5a4a;
  margin: 0 0 12px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #5a7a6a;
  margin: 0;
}

/* About Section */
.about-section {
  padding: 80px 0;
  background: #fff;
}

.about-intro {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.intro-card {
  background: linear-gradient(145deg, #f8f9fa 0%, #fff 100%);
  border-radius: 20px;
  padding: 36px 28px;
  border: 1px solid rgba(45, 122, 107, 0.1);
  transition: all 0.3s ease;
}

.intro-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(45, 122, 107, 0.15);
  border-color: rgba(45, 122, 107, 0.2);
}

.intro-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.intro-card h3 {
  font-size: 1.3rem;
  color: #1e5a4a;
  margin: 0 0 12px;
  font-weight: 600;
}

.intro-card p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #5a6a5f;
  margin: 0;
}

/* Skills Section */
.skills-section {
  padding: 80px 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f4f2 100%);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.skill-category {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid rgba(45, 122, 107, 0.08);
  transition: all 0.3s ease;
}

.skill-category:hover {
  box-shadow: 0 8px 30px rgba(45, 122, 107, 0.1);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  color: #1e5a4a;
  margin: 0 0 16px;
  font-weight: 600;
}

.category-icon {
  font-size: 1.4rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.08) 0%, rgba(139, 111, 71, 0.08) 100%);
  color: #2d7a6b;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.15) 0%, rgba(139, 111, 71, 0.15) 100%);
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: #fff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: linear-gradient(145deg, #f8f9fa 0%, #fff 100%);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(45, 122, 107, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 35px rgba(45, 122, 107, 0.12);
  border-color: rgba(45, 122, 107, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 1.2rem;
  color: #1e5a4a;
  margin: 0 0 10px;
  font-weight: 600;
}

.feature-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #5a6a5f;
  margin: 0;
}

/* Contact Section */
.contact-section {
  padding: 80px 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f4f2 100%);
}

.contact-card {
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 50%, #8b6f47 100%);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: #fff;
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.contact-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 40px;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.link-icon {
  font-size: 1.3rem;
}

.tech-stack {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.tech-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 16px;
}

.tech-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-badge {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Footer */
.page-footer {
  padding: 30px;
  text-align: center;
  background: #fff;
  border-top: 1px solid rgba(45, 122, 107, 0.1);
}

.page-footer p {
  margin: 0;
  color: #7a8a7f;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px 50px;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
    padding: 20px 30px;
  }
  
  .stat-divider {
    width: 60px;
    height: 1px;
  }
  
  .about-intro {
    grid-template-columns: 1fr;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-card {
    padding: 40px 24px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}
</style>
