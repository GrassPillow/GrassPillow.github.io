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
        <div class="hero-badge">📦 持续收录 · 全部免费正版渠道</div>
        <h1 class="hero-name">资源站</h1>
        <p class="hero-title">发现好用的网络资源</p>
        <p class="hero-description">
          精选网站工具、软件应用、学习资料与影视音乐电子书，<br />
          帮你省下到处找资源的时间。
        </p>
        <div class="hero-search">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索资源，例如：PDF、AI、笔记..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalCount }}</span>
            <span class="stat-label">个资源</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ categoryCount }}</span>
            <span class="stat-label">个分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ typeCount }}</span>
            <span class="stat-label">大类别</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类入口 -->
    <main class="main-content">
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">资源分类</h2>
          <div class="categories-grid">
            <router-link
              v-for="cat in categories"
              :key="cat.type"
              :to="`/resources/${cat.type}`"
              class="category-card"
            >
              <div class="category-icon">{{ cat.icon }}</div>
              <h3 class="category-name">{{ cat.name }}</h3>
              <p class="category-desc">{{ cat.desc }}</p>
              <div class="category-footer">
                <span class="category-count">{{ countByType[cat.type] || 0 }} 个资源</span>
                <span class="category-arrow">→</span>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- 精选推荐 -->
      <section class="featured-section" v-if="featured.length > 0">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">精选推荐</h2>
            <router-link to="/resources/all" class="view-all">查看全部 →</router-link>
          </div>
          <div class="featured-grid">
            <a
              v-for="item in featured"
              :key="`${item.type}-${item.url}`"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="featured-card"
            >
              <div class="featured-top">
                <span class="featured-logo">{{ getInitial(item.name) }}</span>
                <span class="featured-type">{{ getTypeName(item.type) }}</span>
              </div>
              <h3 class="featured-name">{{ item.name }}</h3>
              <p class="featured-desc">{{ item.description }}</p>
              <span class="featured-category">{{ item.category }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- 资源维护说明 -->
      <section class="about-section">
        <div class="container">
          <h2 class="section-title">关于本站</h2>
          <p class="about-text">
            本站收录的全部资源均来自公开、正版或免费授权渠道，不做任何盗版内容索引。
            链接如遇失效，欢迎反馈更新。资源持续扩充中，敬请期待。
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { parseCSV } from '../utils/csv.js'

const router = useRouter()
const searchQuery = ref('')
const resources = ref([])
let _isUnmounted = false

const TYPE_NAMES = {
  website: '网站工具',
  software: '软件应用',
  learning: '学习资料',
  media: '影视音乐'
}

const categories = [
  { type: 'website', icon: '🌐', name: '网站工具', desc: 'AI 助手、在线工具、设计素材与开发者网站' },
  { type: 'software', icon: '💻', name: '软件应用', desc: '免费开源软件，覆盖系统、办公、开发与创作' },
  { type: 'learning', icon: '📚', name: '学习资料', desc: '公开课、编程学习与权威文档手册' },
  { type: 'media', icon: '🎬', name: '影视音乐电子书', desc: '正版免费影视、音乐与公版电子书' }
]

const totalCount = computed(() => resources.value.length)
const categoryCount = computed(() => {
  const set = new Set()
  resources.value.forEach(r => set.add(`${r.type}-${r.category}`))
  return set.size
})
const typeCount = computed(() => {
  const set = new Set()
  resources.value.forEach(r => set.add(r.type))
  return set.size
})

const countByType = computed(() => {
  const map = {}
  resources.value.forEach(r => {
    map[r.type] = (map[r.type] || 0) + 1
  })
  return map
})

const featured = computed(() => {
  const perType = {}
  const result = []
  resources.value.forEach(r => {
    if (!perType[r.type]) perType[r.type] = []
    if (perType[r.type].length < 4) {
      perType[r.type].push(r)
      result.push(r)
    }
  })
  return result
})

function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase()
}

function getTypeName(type) {
  return TYPE_NAMES[type] || type
}

function handleSearch() {
  const q = searchQuery.value.trim()
  router.push({ path: '/resources/all', query: q ? { q } : {} })
}

async function loadData() {
  try {
    const response = await axios.get('/resources.csv')
    if (_isUnmounted) return
    resources.value = parseCSV(response.data)
  } catch (error) {
    if (_isUnmounted) return
    console.error('加载资源数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  _isUnmounted = true
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: var(--c-bg-page);
}

/* Hero */
.hero-section {
  position: relative;
  background: var(--c-primary-dark);
  color: #fff;
  padding: 7rem 1.5rem 6rem;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  animation: float 18s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 360px;
  height: 360px;
  bottom: -140px;
  left: -80px;
  animation-delay: -6s;
}

.orb-3 {
  width: 220px;
  height: 220px;
  top: 40%;
  left: 12%;
  animation-delay: -12s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.08); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: fadeInDown 0.6s ease-out;
}

.hero-name {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  animation: fadeInDown 0.7s ease-out 0.1s both;
}

.hero-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 1rem;
  opacity: 0.92;
  animation: fadeInDown 0.7s ease-out 0.2s both;
}

.hero-description {
  font-size: 1.15rem;
  line-height: 1.7;
  opacity: 0.85;
  margin: 0 0 2.2rem;
  animation: fadeInDown 0.7s ease-out 0.3s both;
}

.hero-search {
  display: flex;
  align-items: center;
  max-width: 640px;
  margin: 0 auto 2.5rem;
  background: #fff;
  border-radius: 999px;
  padding: 0.4rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  animation: fadeInUp 0.7s ease-out 0.4s both;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.6rem;
  font-size: 1.2rem;
  pointer-events: none;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.05rem;
  padding: 0.9rem 1rem 0.9rem 3.4rem;
  background: transparent;
  color: var(--c-text);
  font-family: inherit;
}

.search-btn {
  border: none;
  background: var(--c-primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.search-btn:hover {
  background: var(--c-primary-dark);
  transform: translateY(-1px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  animation: fadeInUp 0.7s ease-out 0.5s both;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Main */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--c-text);
  margin: 0 0 1.8rem;
  letter-spacing: -0.02em;
}

.categories-section {
  margin-bottom: 3.5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.category-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-decoration: none;
  color: var(--c-text);
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
  display: block;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--c-primary);
}

.category-icon {
  font-size: 2.6rem;
  margin-bottom: 1rem;
  display: block;
}

.category-name {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 0.6rem;
  color: var(--c-text);
}

.category-desc {
  font-size: 0.95rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin: 0 0 1.4rem;
  min-height: 3em;
}

.category-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--c-border);
}

.category-count {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-primary);
}

.category-arrow {
  font-size: 1.1rem;
  color: var(--c-text-muted);
  transition: transform 0.2s ease;
}

.category-card:hover .category-arrow {
  transform: translateX(4px);
  color: var(--c-primary);
}

/* Featured */
.featured-section {
  margin-bottom: 3.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.view-all {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-primary);
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.featured-card {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-decoration: none;
  color: var(--c-text);
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
  display: block;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-primary);
}

.featured-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.featured-logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--c-primary-light);
  color: var(--c-primary);
  font-weight: 800;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-type {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-text-muted);
  background: var(--c-bg-warm);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
}

.featured-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--c-text);
}

.featured-desc {
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-category {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-primary);
}

/* About */
.about-section {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.about-text {
  font-size: 1rem;
  color: var(--c-text-secondary);
  line-height: 1.8;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 5rem 1rem 4rem;
  }

  .hero-name {
    font-size: 2.8rem;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .stat-value {
    font-size: 1.8rem;
  }
}

@media (max-width: 560px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .hero-search {
    flex-direction: column;
    border-radius: 24px;
    padding: 0.8rem;
  }

  .search-icon {
    display: none;
  }

  .search-input {
    width: 100%;
    padding: 0.9rem 1rem;
    text-align: center;
  }

  .search-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }
}
</style>
