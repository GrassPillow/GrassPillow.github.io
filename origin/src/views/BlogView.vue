<template>
  <div class="blog-view">
    <div class="blog-header">
      <h1 class="blog-title">我的博客</h1>
      <p class="blog-subtitle">分享技术、记录生活、探索世界</p>
      <div class="blog-actions">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索文章..." 
            v-model="searchQuery"
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <router-link to="/blog/manage" class="write-button">
          <span class="write-icon">✏️</span>
          写文章
        </router-link>
      </div>
    </div>

    <div class="blog-content">
      <div class="blog-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">分类</h3>
          <div class="category-list">
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">({{ category.count }})</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">标签</h3>
          <div class="tag-cloud">
            <span 
              v-for="tag in tags" 
              :key="tag.id"
              class="tag"
              :class="{ active: selectedTags.includes(tag.id) }"
              :style="{ backgroundColor: tag.color }"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="blog-main">
        <div class="blog-posts">
          <div 
            v-for="post in filteredPosts" 
            :key="post.id"
            class="post-card"
            @click="goToPost(post.id)"
          >
            <div class="post-image" v-if="post.coverImage">
              <img :src="post.coverImage" :alt="post.title" />
            </div>
            <div class="post-content">
              <div class="post-meta">
                <span class="post-category">{{ getCategoryName(post.categoryId) }}</span>
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
              </div>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-tags">
                <span 
                  v-for="tagId in post.tagIds" 
                  :key="tagId"
                  class="post-tag"
                  :style="{ backgroundColor: getTagColor(tagId) }"
                >
                  {{ getTagName(tagId) }}
                </span>
              </div>
              <div class="post-footer">
                <span class="post-author">by {{ post.author }}</span>
                <div class="post-stats">
                  <span class="post-views">👁 {{ post.views }}</span>
                  <span class="post-likes">👍 {{ post.likes }}</span>
                  <span class="post-comments">💬 {{ post.comments }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="pagination-button" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <div class="pagination-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="pagination-number"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button 
            class="pagination-button" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedTags = ref([])
const currentPage = ref(1)
const postsPerPage = 6

// 模拟数据
const posts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: 'Vue 3 引入的 Composition API 为我们提供了更灵活的组件逻辑组织方式。本文将深入探讨 Composition API 的核心概念、使用场景以及最佳实践...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 2],
    coverImage: 'https://picsum.photos/seed/vue3/800/400.jpg',
    createdAt: new Date('2025-01-05'),
    views: 1250,
    likes: 42,
    comments: 8
  },
  {
    id: 2,
    title: '现代前端开发工具链配置指南',
    excerpt: '从零开始搭建一个高效的前端开发环境，包括 Vite、ESLint、Prettier、TypeScript 等工具的配置与集成，以及如何优化构建性能...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 3],
    coverImage: 'https://picsum.photos/seed/frontend/800/400.jpg',
    createdAt: new Date('2025-01-03'),
    views: 980,
    likes: 35,
    comments: 5
  },
  {
    id: 3,
    title: '个人博客搭建全记录',
    excerpt: '记录从零开始搭建个人博客的整个过程，包括技术选型、UI设计、功能实现以及部署上线的完整流程和经验分享...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 2,
    tagIds: [2, 4],
    coverImage: 'https://picsum.photos/seed/blog/800/400.jpg',
    createdAt: new Date('2025-01-01'),
    views: 2100,
    likes: 68,
    comments: 12
  },
  {
    id: 4,
    title: 'JavaScript 异步编程演进史',
    excerpt: '从回调函数到 Promise，再到 async/await，JavaScript 异步编程经历了怎样的演进过程？本文将带你回顾这段历史，并探讨未来的发展方向...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 5],
    coverImage: 'https://picsum.photos/seed/javascript/800/400.jpg',
    createdAt: new Date('2024-12-28'),
    views: 1560,
    likes: 52,
    comments: 9
  },
  {
    id: 5,
    title: 'CSS Grid 布局完全指南',
    excerpt: 'CSS Grid 是现代网页布局的强大工具，本文将全面介绍 Grid 布局的概念、属性、使用技巧以及实际应用场景，帮助你掌握这一重要技术...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [3, 6],
    coverImage: 'https://picsum.photos/seed/cssgrid/800/400.jpg',
    createdAt: new Date('2024-12-25'),
    views: 1320,
    likes: 45,
    comments: 7
  },
  {
    id: 6,
    title: '2024 年度技术总结与展望',
    excerpt: '回顾 2024 年技术领域的重要变化，包括前端框架、后端技术、AI 应用等方面的发展，并对 2025 年的技术趋势进行展望...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 3,
    tagIds: [4, 7],
    coverImage: 'https://picsum.photos/seed/2024review/800/400.jpg',
    createdAt: new Date('2024-12-20'),
    views: 3200,
    likes: 98,
    comments: 15
  }
])

const categories = ref([
  { id: 1, name: '技术', count: 4 },
  { id: 2, name: '生活', count: 1 },
  { id: 3, name: '随笔', count: 1 }
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
const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
  }
  
  // 按分类过滤
  if (selectedCategory.value) {
    result = result.filter(post => post.categoryId === selectedCategory.value)
  }
  
  // 按标签过滤
  if (selectedTags.value.length > 0) {
    result = result.filter(post => 
      selectedTags.value.some(tagId => post.tagIds.includes(tagId))
    )
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return result.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  let result = [...posts.value]
  
  // 应用相同的过滤条件
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(post => post.categoryId === selectedCategory.value)
  }
  
  if (selectedTags.value.length > 0) {
    result = result.filter(post => 
      selectedTags.value.some(tagId => post.tagIds.includes(tagId))
    )
  }
  
  return Math.ceil(result.length / postsPerPage)
})

// 方法
const selectCategory = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
  currentPage.value = 1
}

const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
}

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToPost = (postId) => {
  router.push(`/blog/post/${postId}`)
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : ''
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

// 生命周期
onMounted(() => {
  // 可以在这里从API获取数据
})
</script>

<style scoped>
.blog-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.blog-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: #1e5a4a;
}

.blog-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin: 0 0 2rem 0;
}

.blog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #2d7a6b;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.write-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--c-primary);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.write-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

.blog-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.blog-sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #333;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-item:hover {
  background-color: #f5f5f5;
}

.category-item.active {
  background-color: rgba(45, 122, 107, 0.1);
  color: #2d7a6b;
  font-weight: 600;
}

.category-count {
  color: #999;
  font-size: 0.875rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.3s, opacity 0.3s;
}

.tag:hover {
  transform: scale(1.05);
}

.tag.active {
  opacity: 0.7;
  transform: scale(0.95);
}

.blog-main {
  min-height: 500px;
}

.blog-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-image {
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.post-category {
  color: #2d7a6b;
  font-weight: 600;
}

.post-date {
  color: #999;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  color: #333;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #999;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-number:hover {
  background-color: #f5f5f5;
}

.pagination-number.active {
  background: var(--c-primary);
  color: white;
  border-color: transparent;
}

@media (max-width: 1024px) {
  .blog-content {
    grid-template-columns: 1fr;
  }
  
  .blog-sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .sidebar-section {
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .blog-view {
    padding: 1rem;
  }
  
  .blog-title {
    font-size: 2.5rem;
  }
  
  .blog-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .search-box {
    width: 100%;
    max-width: 300px;
  }
  
  .blog-posts {
    grid-template-columns: 1fr;
  }
  
  .blog-sidebar {
    grid-template-columns: 1fr;
  }
}
</style>