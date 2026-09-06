<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-avatar">
          <img src="https://picsum.photos/seed/grasspillow/200/200.jpg" alt="GrassPillow" loading="lazy" />
        </div>
        <h1 class="hero-name">GrassPillow</h1>
        <p class="hero-title">全栈开发者 · 技术博主 · 开源爱好者</p>
        <p class="hero-description">
          热爱技术，享受创造。专注于构建优雅、高效的Web应用，
          致力于用代码解决实际问题，让技术服务于生活。
        </p>
        <div class="hero-actions">
          <router-link to="/about" class="btn btn-primary">
            <span>👋</span> 了解更多
          </router-link>
          <router-link to="/projects" class="btn btn-secondary">
            <span>💼</span> 查看作品
          </router-link>
        </div>
        <div class="hero-social">
          <a href="https://github.com/GrassPillow" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="mailto:contact@grasspillow.com" class="social-link" title="Email" aria-label="Email">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills-section">
      <div class="container">
        <h2 class="section-title">技术栈</h2>
        <div class="skills-grid">
          <div class="skill-card" v-for="skill in skills" :key="skill.name">
            <div class="skill-icon">{{ skill.icon }}</div>
            <h3 class="skill-name">{{ skill.name }}</h3>
            <p class="skill-desc">{{ skill.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="projects-section">
      <div class="container">
        <h2 class="section-title">精选项目</h2>
        <div class="projects-grid">
          <div class="project-card" v-for="project in projects" :key="project.name">
            <div class="project-image">
              <img :src="project.image" :alt="project.name" loading="lazy" />
            </div>
            <div class="project-content">
              <h3 class="project-name">{{ project.name }}</h3>
              <p class="project-desc">{{ project.description }}</p>
              <div class="project-tags">
                <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="project-links">
                <a :href="project.demo" target="_blank" rel="noopener noreferrer" class="project-link" v-if="project.demo">在线演示</a>
                <a :href="project.github" target="_blank" rel="noopener noreferrer" class="project-link" v-if="project.github">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-card">
          <h2>一起创造</h2>
          <p>有项目想法或合作机会？欢迎联系我！</p>
          <a href="mailto:contact@grasspillow.com" class="btn btn-primary btn-large">
            <span>✉️</span> 发送邮件
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
  { icon: '🎨', name: '前端开发', description: 'Vue.js, React, TypeScript, CSS3' },
  { icon: '⚙️', name: '后端开发', description: 'Node.js, Express, Python, RESTful API' },
  { icon: '🗄️', name: '数据库', description: 'MySQL, MongoDB, PostgreSQL, Redis' },
  { icon: '🛠️', name: '开发工具', description: 'Git, Docker, VS Code, Linux' }
])

const projects = ref([
  {
    name: '个人博客',
    description: '基于Vue 3构建的个人博客系统，支持文章发布、分类管理、标签筛选等功能。',
    image: 'https://picsum.photos/seed/blog/400/250.jpg',
    tags: ['Vue 3', 'TypeScript', 'Vue Router'],
    demo: '/',
    github: 'https://github.com/GrassPillow'
  },
  {
    name: 'AI工具集合',
    description: '集成多种AI工具的在线平台，包括文本处理、代码格式化、密码生成等实用功能。',
    image: 'https://picsum.photos/seed/ai/400/250.jpg',
    tags: ['Vue.js', 'Ant Design', 'Axios'],
    demo: '/tools/ai',
    github: null
  },
  {
    name: '地震监测系统',
    description: '实时展示全球地震数据，支持地图可视化和历史数据查询分析。',
    image: 'https://picsum.photos/seed/earthquake/400/250.jpg',
    tags: ['高德地图', '数据可视化', 'API'],
    demo: '/tools/earthquake',
    github: null
  },
])
</script>

<style scoped>
.home-view {
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
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 40%, #8b6f47 100%);
  overflow: hidden;
  padding: 60px 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: -150px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  left: -80px;
  animation-delay: -7s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 60%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
}

.hero-avatar {
  width: 140px;
  height: 140px;
  margin: 0 auto 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-name {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-title {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 20px;
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin: 0 0 32px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #fff;
  color: #1e5a4a;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.btn-large {
  padding: 16px 36px;
  font-size: 1.1rem;
}

.hero-social {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-link {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

/* Section Styles */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 48px;
  color: #1e5a4a;
}

/* Skills Section */
.skills-section {
  padding: 80px 0;
  background: #fff;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.skill-card {
  background: linear-gradient(145deg, #f8f9fa 0%, #fff 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(45, 122, 107, 0.1);
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.12);
  border-color: rgba(45, 122, 107, 0.2);
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.skill-name {
  font-size: 1.2rem;
  color: #1e5a4a;
  margin: 0 0 8px;
  font-weight: 600;
}

.skill-desc {
  font-size: 0.9rem;
  color: #5a6a5f;
  margin: 0;
  line-height: 1.5;
}

/* Projects Section */
.projects-section {
  padding: 80px 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f4f2 100%);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.project-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(45, 122, 107, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(45, 122, 107, 0.15);
}

.project-image {
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  padding: 24px;
}

.project-name {
  font-size: 1.3rem;
  color: #1e5a4a;
  margin: 0 0 12px;
  font-weight: 600;
}

.project-desc {
  font-size: 0.95rem;
  color: #5a6a5f;
  line-height: 1.6;
  margin: 0 0 16px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  color: #2d7a6b;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 6px;
}

.project-links {
  display: flex;
  gap: 12px;
}

.project-link {
  padding: 8px 16px;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.project-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

/* Contact Section */
.contact-section {
  padding: 80px 0;
  background: #fff;
}

.contact-card {
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 50%, #8b6f47 100%);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: #fff;
}

.contact-card h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.contact-card p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 32px;
}

/* Responsive */
@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 60px 24px;
  }
  
  .hero-name {
    font-size: 2.2rem;
  }
  
  .hero-title {
    font-size: 1.1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}
</style>
