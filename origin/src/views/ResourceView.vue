<template>
  <div class="resource-view">
    <!-- 加载失败提示（区别于"无匹配结果"） -->
    <div v-if="loadError" class="load-error">
      <div class="load-error-icon">⚠️</div>
      <h3 class="load-error-title">资源数据加载失败</h3>
      <p class="load-error-desc">{{ loadError }}</p>
      <button class="load-error-btn" @click="loadData">重试</button>
    </div>

    <template v-else>
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ headerIcon }} {{ headerTitle }}</h1>
        <p class="page-description">{{ headerDesc }}</p>
      </div>
    </header>

    <main class="main-content">
      <!-- 搜索和筛选 -->
      <div class="search-filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="search"
            aria-label="搜索资源"
            :placeholder="`搜索${headerTitle}...`"
            class="search-input"
          />
        </div>
        <div class="filter-tags">
          <button
            v-for="cat in categories"
            :key="cat.value"
            type="button"
            class="filter-tag"
            :aria-pressed="selectedCategory === cat.value || (!selectedCategory && cat.value === 'all')"
            :class="{ active: selectedCategory === cat.value || (!selectedCategory && cat.value === 'all') }"
            @click="selectedCategory = cat.value === 'all' ? '' : cat.value"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- 标签筛选：多选，按「同时满足」过滤 -->
        <div v-if="availableTags.length" class="tag-filter">
          <div class="tag-filter-head">
            <span class="tag-filter-label">🏷️ 标签筛选</span>
            <span v-if="selectedTags.length" class="tag-filter-hint">
              已选 {{ selectedTags.length }} 个，同时满足
            </span>
            <button v-if="selectedTags.length" type="button" class="tag-clear" @click="clearTags">
              清除
            </button>
          </div>
          <div class="filter-tags tag-cloud">
            <button
              v-for="tag in availableTags"
              :key="tag.name"
              type="button"
              class="filter-tag tag-chip"
              :class="{ active: selectedTags.includes(tag.name) }"
              :aria-pressed="selectedTags.includes(tag.name)"
              @click="toggleTag(tag.name)"
            >
              {{ tag.name }}<span class="tag-count">{{ tag.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-icon">📊</span>
          <span class="stat-value">{{ filteredCount }}</span>
          <span class="stat-label">个资源</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📁</span>
          <span class="stat-value">{{ filteredCategoriesCount }}</span>
          <span class="stat-label">个分类</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🏷️</span>
          <span class="stat-value">{{ availableTags.length }}</span>
          <span class="stat-label">个标签</span>
        </div>
      </div>

      <!-- 资源分组展示 -->
      <div class="resources-display" v-if="filteredCategorized && filteredCategoriesCount > 0">
        <div
          v-for="(items, category) in filteredCategorized"
          :key="`category-${category}`"
          class="category-section"
          :class="{ collapsed: collapsedCategories[category] }"
        >
          <div
            class="category-header"
            role="button"
            tabindex="0"
            :aria-expanded="!collapsedCategories[category]"
            @click="toggleCategory(category)"
            @keyup.enter="toggleCategory(category)"
            @keyup.space.prevent="toggleCategory(category)"
          >
            <h3 class="category-title">
              <span class="collapse-icon" aria-hidden="true">{{ collapsedCategories[category] ? '▶' : '▼' }}</span>
              {{ category }}
            </h3>
            <span class="category-count">{{ items.length }}</span>
          </div>
          <div class="resources-grid" v-show="!collapsedCategories[category]">
            <ResourceCard
              v-for="item in items"
              :key="`${category}-${item.url}`"
              :resource="item"
              :highlight="searchQuery"
              @tag-click="toggleTag"
            />
          </div>
        </div>
      </div>

      <!-- 空状态：区分"加载中"与"无匹配结果" -->
      <div v-else class="empty-state">
        <template v-if="isLoading">
          <div class="empty-icon loading-icon">⏳</div>
          <h3 class="empty-title">正在加载资源…</h3>
          <p class="empty-desc">数据加载完成后自动显示</p>
        </template>
        <template v-else>
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">未找到匹配的资源</h3>
          <p class="empty-desc">尝试调整搜索条件，或切换到其他分类</p>
        </template>
      </div>
    </main>
    </template>
  </div>
</template>

<script>
import ResourceCard from '@/components/ResourceCard.vue'
import { loadResources } from '../utils/resources.js'
import { useFavorites } from '../composables/useFavorites.js'

const TYPE_META = {
  website: { name: '网站工具', desc: 'AI 助手、在线工具、设计素材与开发者实用网站', icon: '🌐' },
  software: { name: '软件应用', desc: '免费开源的桌面软件，覆盖系统、办公、开发与创作', icon: '💻' },
  learning: { name: '学习资料', desc: '公开课、编程学习平台与权威文档手册', icon: '📚' },
  media: { name: '影视音乐电子书', desc: '正版免费影视、音乐与公版电子书平台', icon: '🎬' },
  all: { name: '全部资源', desc: '站内全部资源一览，支持全站搜索', icon: '🗂️' }
}

export default {
  name: 'ResourceView',
  components: { ResourceCard },
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      allResources: [],
      searchQuery: '',
      selectedCategory: '',
      selectedTags: [],
      collapsedCategories: {},
      favoriteUrls: new Set(),
      isLoading: true,
      loadError: '',
      // 是否经历过加载失败，决定「重试」时是否绕过缓存
      hasFailed: false
    }
  },
  computed: {
    meta() {
      return TYPE_META[this.type] || TYPE_META.all
    },
    headerTitle() {
      return this.meta.name
    },
    headerDesc() {
      return this.meta.desc
    },
    headerIcon() {
      return this.meta.icon
    },
    categories() {
      const set = new Set()
      this.filteredByType.forEach(r => {
        if (r.category) set.add(r.category)
      })
      const list = [{ value: 'all', label: '全部' }]
      // 收藏筛选：仅当存在收藏条目时展示
      if (this.favoriteUrls.size > 0) {
        list.push({ value: 'favorites', label: `★ 收藏 (${this.favoriteUrls.size})` })
      }
      Array.from(set).forEach(c => list.push({ value: c, label: c }))
      return list
    },
    filteredByType() {
      if (!this.allResources || !Array.isArray(this.allResources)) return []
      if (this.type === 'all') return this.allResources
      return this.allResources.filter(r => r.type === this.type)
    },
    // 当前大类下出现过的标签，按资源数降序
    availableTags() {
      const counts = {}
      this.filteredByType.forEach(r => {
        (r.tags || []).forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1
        })
      })
      return Object.keys(counts)
        .map(name => ({ name, count: counts[name] }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
    },
    filteredResources() {
      let filtered = this.filteredByType

      if (this.selectedCategory === 'favorites') {
        filtered = filtered.filter(r => this.favoriteUrls.has(r.url))
      } else if (this.selectedCategory) {
        filtered = filtered.filter(r => r.category === this.selectedCategory)
      }

      // 多选标签：需同时命中所有已选标签
      if (this.selectedTags.length) {
        filtered = filtered.filter(r =>
          this.selectedTags.every(tag => (r.tags || []).includes(tag))
        )
      }

      if (this.searchQuery && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(r =>
          (r.name && r.name.toLowerCase().includes(query)) ||
          (r.description && r.description.toLowerCase().includes(query)) ||
          (r.url && r.url.toLowerCase().includes(query)) ||
          (r.tags || []).some(tag => tag.toLowerCase().includes(query))
        )
      }

      return filtered
    },
    filteredCategorized() {
      const map = {}
      this.filteredResources.forEach(r => {
        if (!r.category) return
        if (!map[r.category]) map[r.category] = []
        map[r.category].push(r)
      })
      return map
    },
    filteredCount() {
      return this.filteredResources.length
    },
    filteredCategoriesCount() {
      return Object.keys(this.filteredCategorized).length
    }
  },
  watch: {
    '$route.query.q'(q) {
      this.searchQuery = q || ''
    },
    // 支持浏览器前进/后退与直接分享带标签的链接
    '$route.query.tags'() {
      this.readTagsFromQuery()
    },
    type() {
      this.selectedCategory = ''
      this.collapsedCategories = {}
      this.selectedTags = []
      this.syncTagsToQuery()
    }
  },
  methods: {
    syncFavorites() {
      this.favoriteUrls = this.$favorites.getFavorites()
    },
    toggleCategory(category) {
      this.collapsedCategories[category] = !this.collapsedCategories[category]
    },
    // 从 ?tags=a,b 读取，过滤掉不属于当前大类的标签
    readTagsFromQuery() {
      const raw = this.$route.query.tags
      const text = Array.isArray(raw) ? raw.join(',') : (raw || '')
      const list = text.split(',').map(t => t.trim()).filter(Boolean)
      const allowed = new Set(this.availableTags.map(t => t.name))
      // 数据尚未加载时先全量接收，加载完再裁剪
      this.selectedTags = allowed.size ? list.filter(t => allowed.has(t)) : list
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index >= 0) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
      this.syncTagsToQuery()
    },
    clearTags() {
      this.selectedTags = []
      this.syncTagsToQuery()
    },
    // 把标签写回 URL，保证可分享、可前进后退
    syncTagsToQuery() {
      const next = this.selectedTags.join(',')
      const current = this.$route.query.tags || ''
      if (String(current) === next) return
      const query = { ...this.$route.query }
      if (next) {
        query.tags = next
      } else {
        delete query.tags
      }
      this.$router.replace({ path: this.$route.path, query }).catch(() => {})
    },
    // 数据加载后剔除当前大类不存在的标签
    pruneSelectedTags() {
      const allowed = new Set(this.availableTags.map(t => t.name))
      const pruned = this.selectedTags.filter(t => allowed.has(t))
      if (pruned.length !== this.selectedTags.length) {
        this.selectedTags = pruned
        this.syncTagsToQuery()
      }
    },
    async loadData() {
      this.isLoading = true
      this.loadError = ''
      try {
        // 重试时跳过缓存，确保拿到最新数据文件
        const items = await loadResources({ force: this.hasFailed })
        if (this._isUnmounted) return
        this.allResources = items
        this.hasFailed = false
        this.pruneSelectedTags()
      } catch (error) {
        if (this._isUnmounted) return
        console.error('加载资源数据失败:', error)
        this.allResources = []
        this.hasFailed = true
        this.loadError = error?.message || '无法获取资源数据，请检查网络后重试。'
      } finally {
        if (!this._isUnmounted) {
          this.isLoading = false
        }
      }
    }
  },
  created() {
    this._isUnmounted = false
    this.$favorites = useFavorites()
    this.favoriteUrls = this.$favorites.getFavorites()
    if (this.$route.query && this.$route.query.q) {
      this.searchQuery = this.$route.query.q
    }
    this.readTagsFromQuery()
  },
  mounted() {
    this._stopFavWatch = this.$favorites.onFavoritesChange(() => {
      if (!this._isUnmounted) this.syncFavorites()
    })
    this.loadData()
  },
  beforeUnmount() {
    this._isUnmounted = true
    if (this._stopFavWatch) this._stopFavWatch()
  }
}
</script>

<style scoped>
.resource-view {
  min-height: 100vh;
  background: var(--c-bg-page);
  padding-bottom: 3rem;
}

.page-header {
  background: var(--c-primary-dark);
  color: var(--c-text-inverse);
  padding: 5rem 1rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: rgba(var(--c-primary-rgb), 0.12);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: rgba(var(--c-primary-rgb), 0.08);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 3.4rem;
  font-weight: 900;
  margin: 0 0 1rem;
  text-shadow: 0 4px 24px rgba(var(--c-shadow-rgb), 0.4);
  letter-spacing: -0.03em;
  animation: fadeInDown 0.8s ease-out;
  color: var(--c-text-inverse);
}

.page-description {
  font-size: 1.2rem;
  opacity: 0.95;
  margin: 0;
  text-shadow: 0 2px 12px rgba(var(--c-shadow-rgb), 0.3);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  line-height: 1.6;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 搜索和筛选栏 */
.search-filter-bar {
  background: var(--c-bg-card);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  border: 1px solid var(--c-border);
  animation: slideInUp 0.6s ease-out 0.3s both;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 1.2rem 1.3rem 1.2rem 3.8rem;
  border: 2px solid var(--c-border);
  border-radius: 18px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background: var(--c-bg-page);
  color: var(--c-text);
  font-family: inherit;
  box-shadow: var(--shadow-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 4px var(--c-primary-light);
  background: var(--c-bg-card);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tag {
  padding: 0.8rem 1.6rem;
  border: 2px solid var(--c-border);
  border-radius: 28px;
  background: var(--c-bg-card);
  color: var(--c-text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 600;
}

.filter-tag:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.filter-tag.active {
  background: var(--c-primary);
  border-color: transparent;
  color: var(--c-text-inverse);
  box-shadow: var(--shadow-md);
}

/* 标签筛选 */
.tag-filter {
  margin-top: 1.6rem;
  padding-top: 1.4rem;
  border-top: 1px dashed var(--c-border);
}

.tag-filter-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.tag-filter-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-text-secondary);
}

.tag-filter-hint {
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.tag-clear {
  margin-left: auto;
  padding: 0.3rem 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: transparent;
  color: var(--c-text-secondary);
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-clear:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.tag-chip {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.tag-count {
  font-size: 0.72rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
}

.tag-chip.active .tag-count {
  opacity: 0.85;
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
  padding: 1.6rem 2.5rem;
  background: var(--c-bg-card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-border);
  animation: slideInUp 0.6s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.6rem 1.4rem;
  background: var(--c-bg-warm);
  border-radius: 16px;
}

.stat-icon {
  font-size: 1.6rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--c-primary);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  color: var(--c-text-secondary);
  font-weight: 500;
}

/* 分组展示 */
.resources-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  background: var(--c-bg-card);
  padding: 2rem;
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-border);
  transition: all 0.3s ease;
}

.category-section:hover {
  box-shadow: var(--shadow-md);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0.6rem 0.5rem;
  border-bottom: 2px solid var(--c-border);
  cursor: pointer;
  user-select: none;
}

.category-header:focus-visible {
  outline: 3px solid var(--c-primary);
  outline-offset: 3px;
  border-radius: 6px;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.collapse-icon {
  font-size: 0.85rem;
  color: var(--c-primary);
  transition: transform 0.3s ease;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary-light);
  border-radius: 50%;
}

.category-section.collapsed .collapse-icon {
  transform: rotate(-90deg);
}

.category-count {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-text-inverse);
  background: var(--c-primary);
  padding: 0.4rem 1.1rem;
  border-radius: 24px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* 加载失败 */
.load-error {
  max-width: 640px;
  margin: 6rem auto;
  padding: 2.5rem 2rem;
  text-align: center;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
}

.load-error-icon {
  font-size: 4rem;
  margin-bottom: 1.2rem;
}

.load-error-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--c-text);
  margin: 0 0 0.8rem;
}

.load-error-desc {
  font-size: 1rem;
  color: var(--c-text-secondary);
  margin: 0 0 1.8rem;
  line-height: 1.6;
}

.load-error-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 26px;
  background: var(--c-primary);
  color: var(--c-text-inverse);
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-error-btn:hover {
  background: var(--c-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.loading-icon {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: var(--c-bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-border);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--c-text);
  margin: 0 0 0.8rem;
}

.empty-desc {
  font-size: 1.1rem;
  color: var(--c-text-secondary);
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .resources-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.4rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .search-filter-bar {
    padding: 1.5rem;
  }

  .stats-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }

  .category-section {
    padding: 1.4rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 3rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .main-content {
    padding: 0 1rem;
  }

  .search-filter-bar {
    padding: 1.2rem;
  }

  .filter-tag {
    padding: 0.55rem 1.1rem;
    font-size: 0.85rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .category-title {
    font-size: 1.25rem;
  }
}
</style>
