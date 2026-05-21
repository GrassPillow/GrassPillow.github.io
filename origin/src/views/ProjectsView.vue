<template>
  <div class="projects-view">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">我的作品</h1>
        <p class="page-subtitle">展示我的项目作品和技术实践</p>
      </div>
    </header>

    <main class="main-content">
      <!-- Filter Tags -->
      <div class="filter-bar">
        <button
          v-for="category in categories"
          :key="category.value"
          class="filter-btn"
          :class="{ active: selectedCategory === category.value }"
          @click="selectedCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid">
        <article
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" loading="lazy" />
            <div class="project-overlay">
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                class="overlay-btn"
              >
                查看演示
              </a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="overlay-btn overlay-btn-secondary"
              >
                GitHub
              </a>
            </div>
          </div>
          <div class="project-content">
            <div class="project-category">{{ project.category }}</div>
            <h2 class="project-title">{{ project.title }}</h2>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('all')

const categories = ref([
  { value: 'all', label: '全部' },
  { value: 'web', label: 'Web应用' },
  { value: 'tool', label: '工具' },
  { value: 'demo', label: '演示' }
])

const projects = ref([
  {
    id: 1,
    title: '个人博客系统',
    description: '基于Vue 3构建的现代化个人博客，支持文章发布、分类管理、标签筛选，拥有精美的UI设计和流畅的用户体验。',
    image: 'https://picsum.photos/seed/blog-system/600/400.jpg',
    category: 'web',
    tags: ['Vue 3', 'TypeScript', 'Vue Router', 'CSS3'],
    demo: '/',
    github: 'https://github.com/GrassPillow'
  },
  {
    id: 2,
    title: 'AI工具集合',
    description: '集成多种实用AI工具的在线平台，包括文本处理、代码格式化、密码生成等功能，提升工作效率。',
    image: 'https://picsum.photos/seed/ai-tools/600/400.jpg',
    category: 'tool',
    tags: ['Vue.js', 'Ant Design', 'Axios'],
    demo: '/tools/ai',
    github: null
  },
  {
    id: 3,
    title: '地震监测系统',
    description: '实时展示全球地震数据的专业平台，支持地图可视化、历史数据查询和数据分析功能。',
    image: 'https://picsum.photos/seed/earthquake/600/400.jpg',
    category: 'tool',
    tags: ['Mapbox', '数据可视化', 'REST API'],
    demo: '/tools/earthquake',
    github: null
  },
{
    id: 5,
    title: '图书管理系统',
    description: '精美的图书管理应用，支持图书浏览、分类筛选、详情查看等功能，界面简洁美观。',
    image: 'https://picsum.photos/seed/books/600/400.jpg',
    category: 'web',
    tags: ['Vue 3', 'CSS Grid', '组件化'],
    demo: '/books',
    github: null
  },
  {
    id: 6,
    title: '时钟工具',
    description: '精美的数字时钟应用，支持多种主题模式，美观实用。',
    image: 'https://picsum.photos/seed/clock/600/400.jpg',
    category: 'tool',
    tags: ['Vue.js', 'CSS3动画', '响应式'],
    demo: '/tools/clock',
    github: null
  }
])

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return projects.value
  }
  return projects.value.filter(p => p.category === selectedCategory.value)
})
</script>

<style scoped>
.projects-view {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 40%, #8b6f47 100%);
  padding: 80px 24px;
  text-align: center;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 24px;
  background: #fff;
  border: 1px solid rgba(45, 122, 107, 0.2);
  border-radius: 24px;
  font-size: 0.95rem;
  color: #2d5a4f;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #2d7a6b;
  color: #2d7a6b;
}

.filter-btn.active {
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: #fff;
  border-color: transparent;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.project-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(45, 122, 107, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(45, 122, 107, 0.15);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(45, 122, 107, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 10px 20px;
  background: #fff;
  color: #1e5a4a;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.overlay-btn-secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.overlay-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.project-content {
  padding: 24px;
}

.project-category {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  color: #2d7a6b;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  margin-bottom: 12px;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e5a4a;
  margin: 0 0 12px;
}

.project-desc {
  font-size: 0.9rem;
  color: #5a6a5f;
  line-height: 1.6;
  margin: 0 0 16px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: #f0f4f2;
  color: #2d7a6b;
  font-size: 0.8rem;
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-bar {
    gap: 8px;
  }
  
  .filter-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}
</style>
