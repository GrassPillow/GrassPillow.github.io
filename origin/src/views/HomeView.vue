<template>
  <div class="home-view">
    <div class="blog-hero">
      <div class="hero-content">
        <h1 class="hero-title">GrassPillow 博客</h1>
        <p class="hero-subtitle">分享技术、记录生活、探索世界</p>
        <div class="hero-actions">
          <router-link to="/blog" class="primary-button">
            <span class="button-icon">📝</span>
            浏览博客
          </router-link>
          <router-link to="/blog/manage" class="secondary-button">
            <span class="button-icon">✏️</span>
            写文章
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://picsum.photos/seed/blog-hero/600/400.jpg" alt="Blog Hero" />
      </div>
    </div>

    <div class="latest-posts-section">
      <div class="section-header">
        <h2 class="section-title">最新文章</h2>
        <router-link to="/blog" class="view-all-link">查看全部</router-link>
      </div>
      
      <div class="posts-grid">
        <div 
          v-for="post in latestPosts" 
          :key="post.id" 
          class="post-card"
          @click="goToPost(post.id)"
        >
          <div class="post-cover" v-if="post.coverImage">
            <img :src="post.coverImage" :alt="post.title" />
          </div>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-category" :style="{ backgroundColor: getCategoryColor(post.categoryId) }">
                {{ getCategoryName(post.categoryId) }}
              </span>
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <div class="post-tags">
                <span 
                  v-for="tagId in post.tagIds.slice(0, 2)" 
                  :key="tagId"
                  class="post-tag"
                  :style="{ backgroundColor: getTagColor(tagId) }"
                >
                  {{ getTagName(tagId) }}
                </span>
              </div>
              <div class="post-stats">
                <span class="stat-item">
                  <span class="stat-icon">👁</span>
                  {{ post.views }}
                </span>
                <span class="stat-item">
                  <span class="stat-icon">👍</span>
                  {{ post.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section">
      <div class="about-content">
        <h2 class="about-title">关于我</h2>
        <div class="about-avatar">
          <img src="https://picsum.photos/seed/avatar/150/150.jpg" alt="Avatar" />
        </div>
        <p class="about-description">
          我是 GrassPillow，一名热爱技术的开发者。这个博客记录了我的技术学习、项目经验和生活感悟。
          我相信技术可以改变世界，也希望通过分享与更多人交流学习。
        </p>
        <div class="about-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalPosts }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalCategories }}</div>
            <div class="stat-label">分类</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalTags }}</div>
            <div class="stat-label">标签</div>
          </div>
        </div>
        <router-link to="/about" class="about-link">了解更多 →</router-link>
      </div>
    </div>

    <div class="categories-section">
      <div class="section-header">
        <h2 class="section-title">文章分类</h2>
      </div>
      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
          @click="goToCategory(category.id)"
        >
          <div class="category-icon">{{ getCategoryIcon(category.id) }}</div>
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-count">{{ getCategoryPostCount(category.id) }} 篇文章</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟数据
const posts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: 'Vue 3 引入的 Composition API 为我们提供了更灵活的组件逻辑组织方式。本文将深入探讨 Composition API 的核心概念、使用场景以及最佳实践...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 2],
    coverImage: 'https://picsum.photos/seed/vue3/800/400.jpg',
    createdAt: new Date('2025-01-05'),
    status: 'published',
    views: 1250,
    likes: 42,
    comments: 8
  },
  {
    id: 2,
    title: '现代前端开发工具链配置指南',
    excerpt: '从零开始搭建一个高效的前端开发环境，包括构建工具、代码规范、测试框架等。本文将详细介绍如何配置一个现代化的前端开发工具链...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 3],
    coverImage: 'https://picsum.photos/seed/frontend/800/400.jpg',
    createdAt: new Date('2025-01-03'),
    status: 'published',
    views: 980,
    likes: 35,
    comments: 5
  },
  {
    id: 3,
    title: '个人博客搭建全记录',
    excerpt: '记录从零开始搭建个人博客的整个过程，包括技术选型、设计实现、部署上线等。希望对想要搭建自己博客的朋友有所帮助...',
    author: 'GrassPillow',
    categoryId: 2,
    tagIds: [2, 4],
    coverImage: 'https://picsum.photos/seed/blog/800/400.jpg',
    createdAt: new Date('2025-01-01'),
    status: 'published',
    views: 2100,
    likes: 68,
    comments: 12
  }
])

const categories = ref([
  { id: 1, name: '技术' },
  { id: 2, name: '生活' },
  { id: 3, name: '随笔' }
])

const tags = ref([
  { id: 1, name: 'Vue', color: '#4FC08D' },
  { id: 2, name: '博客', color: '#2d7a6b' },
  { id: 3, name: 'CSS', color: '#1572B6' },
  { id: 4, name: '生活', color: '#8b6f47' },
  { id: 5, name: 'JavaScript', color: '#F7DF1E' },
  { id: 6, name: '布局', color: '#E34C26' },
  { id: 7, name: '年度总结', color: '#FF6B6B' }
])

// 计算属性
const latestPosts = computed(() => {
  return posts.value
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

const totalPosts = computed(() => posts.value.length)
const totalCategories = computed(() => categories.value.length)
const totalTags = computed(() => tags.value.length)

// 方法
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : ''
}

const getCategoryColor = (categoryId) => {
  const colors = {
    1: '#4FC08D', // 技术 - 绿色
    2: '#8b6f47', // 生活 - 棕色
    3: '#FF6B6B'  // 随笔 - 红色
  }
  return colors[categoryId] || '#ccc'
}

const getCategoryIcon = (categoryId) => {
  const icons = {
    1: '💻', // 技术
    2: '🌱', // 生活
    3: '✍️'  // 随笔
  }
  return icons[categoryId] || '📁'
}

const getCategoryPostCount = (categoryId) => {
  return posts.value.filter(post => post.categoryId === categoryId).length
}

const getTagName = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

const getTagColor = (tagId) => {
  const tag = tags.value.find(t => t.id === tagId)
  return tag ? tag.color : '#ccc'
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('zh-CN', options)
}

const goToPost = (postId) => {
  router.push(`/blog/post/${postId}`)
}

const goToCategory = (categoryId) => {
  router.push(`/blog?category=${categoryId}`)
}

// 生命周期
onMounted(() => {
  // 可以在这里从API获取数据
})
</script>

<style scoped>
.home-view {
  width: 100%;
  min-height: calc(100vh - 40px);
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background: #f5f5f7;
}

/* 博客英雄区域 */
.blog-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.blog-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none"/><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/><circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/><circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>');
  background-size: 100px 100px;
  opacity: 0.3;
}

.hero-content {
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  line-height: 1.4;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-button, .secondary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.primary-button {
  background: white;
  color: #2d7a6b;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-image {
  flex: 0 0 400px;
  position: relative;
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 最新文章区域 */
.latest-posts-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.view-all-link {
  color: #2d7a6b;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.view-all-link:hover {
  color: #1e5a4a;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.post-cover {
  height: 200px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.post-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
}

.post-date {
  color: #666;
  font-size: 0.9rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  color: #333;
}

.post-excerpt {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.post-tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 0.8rem;
}

/* 关于我区域 */
.about-section {
  background: white;
  padding: 4rem 2rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-avatar {
  margin-bottom: 2rem;
}

.about-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f5f5f7;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin: 0 0 2rem 0;
}

.about-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #2d7a6b;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.about-link {
  display: inline-block;
  color: #2d7a6b;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.about-link:hover {
  color: #1e5a4a;
}

/* 分类区域 */
.categories-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.category-count {
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-hero {
    flex-direction: column;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .hero-content {
    max-width: 100%;
    margin-bottom: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-image {
    flex: 0 0 auto;
    width: 100%;
    max-width: 400px;
  }
  
  .latest-posts-section, .categories-section {
    padding: 3rem 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .about-stats {
    gap: 1.5rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>

