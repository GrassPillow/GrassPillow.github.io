<template>
  <div class="ai-view">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">🌐 AI网站收集</h1>
        <p class="page-description">发现和收藏优秀的AI工具网站，提升您的工作效率</p>
      </div>
    </header>

    <main class="main-content">
        <!-- 搜索和筛选 -->
        <div class="search-filter-bar">
          <div class="search-box">
          <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索AI网站..."
              class="search-input"
            />
          </div>
          <div class="filter-tags">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="filter-tag"
              :class="{ active: selectedCategory === cat.value || (!selectedCategory && cat.value === 'all') }"
              @click="selectedCategory = cat.value === 'all' ? '' : cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
        
      <!-- 网站统计 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-icon">📊</span>
          <span class="stat-value">{{ filteredWebsitesCount }}</span>
          <span class="stat-label">个网站</span>
          </div>
        <div class="stat-item">
          <span class="stat-icon">📁</span>
          <span class="stat-value">{{ filteredCategoriesCount }}</span>
          <span class="stat-label">个分类</span>
              </div>
        </div>

        <!-- 网站分类展示 -->
        <div class="websites-display" v-if="filteredCategorizedWebsites && filteredCategoriesCount > 0">
          <template
            v-for="(sites, category) in filteredCategorizedWebsites"
          >
            <div
              v-if="sites && Array.isArray(sites) && sites.length > 0"
              :key="`category-${category}`"
              class="category-section"
            :class="{ collapsed: collapsedCategories[category] }"
            >
            <div class="category-header" @click="toggleCategory(category)">
              <h3 class="category-title">
                <span class="collapse-icon">{{ collapsedCategories[category] ? '▶' : '▼' }}</span>
                {{ getCategoryName(category) }}
              </h3>
              <span class="category-count">{{ sites.length }}</span>
            </div>
            <div class="websites-grid" v-show="!collapsedCategories[category]">
                <template
                  v-for="(site, index) in sites"
                >
                  <div
                    v-if="site && site.name"
                    :key="`site-${category}-${index}`"
                    class="website-card"
                  >
                <div class="website-header">
                  <h4 class="website-name">{{ site.name }}</h4>
                </div>
                <p v-if="site.description" class="website-desc">{{ site.description }}</p>
                <div class="website-footer">
                  <a
                    :href="site.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="website-link"
                  >
                    访问网站 →
                  </a>
                  <span class="website-category-badge">{{ getCategoryName(site.category).replace(/[^\u4e00-\u9fa5]/g, '') }}</span>
                </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">未找到匹配的网站</h3>
        <p class="empty-desc">尝试调整搜索条件</p>
      </div>
    </main>

    <!-- Toast 提示 -->
    <transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'

// 解析CSV数据
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue // 跳过空行
    
    const values = []
    let currentValue = ''
    let inQuotes = false
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim())
        currentValue = ''
      } else {
        currentValue += char
      }
    }
    values.push(currentValue.trim())
    
    if (values.length === headers.length) {
      const site = {}
      headers.forEach((header, index) => {
        site[header] = values[index]
      })
      data.push(site)
    }
  }
  
  return data
}

export default {
  name: 'AIView',
  data() {
    return {
      aiWebsites: [],
      searchQuery: '',
      selectedCategory: '',
      categories: [
        { value: 'all', label: '全部' },
        { value: 'chat', label: '💬 对话AI' },
        { value: 'image', label: '🎨 图像生成' },
        { value: 'code', label: '💻 代码助手' },
        { value: 'writing', label: '✍️ 写作助手' },
        { value: 'video', label: '🎬 视频生成' },
        { value: 'design', label: '🎨 设计工具' },
        { value: 'search', label: '🔍 搜索引擎' },
        { value: 'audio', label: '🎵 音频工具' },
        { value: 'navigation', label: '🗺️ 导航集合' }
      ],
      toastMessage: '',
      showToast: false,
      toastType: 'success',
      collapsedCategories: {} // 跟踪每个分类的折叠状态
    }
  },
  computed: {
    filteredWebsites() {
      if (!this.aiWebsites || !Array.isArray(this.aiWebsites)) {
        return []
      }
      let filtered = this.aiWebsites
      
      // 分类筛选
      if (this.selectedCategory) {
        filtered = filtered.filter(site => site.category === this.selectedCategory)
      }
      
      // 搜索筛选
      if (this.searchQuery && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(site => 
          site.name.toLowerCase().includes(query) ||
          (site.description && site.description.toLowerCase().includes(query)) ||
          site.url.toLowerCase().includes(query)
        )
      }
      
      return filtered
    },
    filteredCategorizedWebsites() {
      if (!this.filteredWebsites || !Array.isArray(this.filteredWebsites)) {
        return {}
      }
      const categories = {}
      this.filteredWebsites.forEach(site => {
        if (site && site.category) {
          if (!categories[site.category]) {
            categories[site.category] = []
          }
          categories[site.category].push(site)
        }
      })
      return categories
    },
    filteredWebsitesCount() {
      return this.filteredWebsites ? this.filteredWebsites.length : 0
    },
    filteredCategoriesCount() {
      if (!this.filteredCategorizedWebsites || typeof this.filteredCategorizedWebsites !== 'object') {
        return 0
      }
      return Object.keys(this.filteredCategorizedWebsites).length
    }
  },
  async mounted() {
    try {
      // 从CSV文件加载数据
      const response = await axios.get('/ai-websites.csv')
      const csvData = parseCSV(response.data)
      this.aiWebsites = csvData
      
      // 从本地存储加载用户添加的网站（合并到CSV数据）
    const saved = localStorage.getItem('aiWebsites')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // 合并本地存储的网站（避免重复）
            parsed.forEach(savedSite => {
              const exists = this.aiWebsites.some(site => 
                site.url === savedSite.url || site.name === savedSite.name
              )
              if (!exists) {
                this.aiWebsites.push(savedSite)
              }
            })
        }
      } catch (e) {
          console.error('Failed to load saved websites from localStorage:', e)
        }
      }
    } catch (error) {
      console.error('Failed to load AI websites from CSV:', error)
      // 如果加载失败，使用默认数据
      this.aiWebsites = [
        { name: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI开发的对话AI助手', category: 'chat' },
        { name: 'Claude', url: 'https://claude.ai', description: 'Anthropic开发的AI助手', category: 'chat' },
        { name: 'Midjourney', url: 'https://www.midjourney.com', description: 'AI图像生成工具', category: 'image' },
        { name: 'DALL-E', url: 'https://openai.com/dall-e-2', description: 'OpenAI的图像生成AI', category: 'image' },
        { name: 'Stable Diffusion', url: 'https://stability.ai', description: '开源的图像生成模型', category: 'image' },
        { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: 'AI代码助手', category: 'code' },
        { name: 'Cursor', url: 'https://cursor.sh', description: 'AI驱动的代码编辑器', category: 'code' },
        { name: 'Notion AI', url: 'https://www.notion.so/product/ai', description: 'AI写作助手', category: 'writing' },
        { name: 'Jasper', url: 'https://www.jasper.ai', description: 'AI内容创作平台', category: 'writing' },
        { name: 'Runway', url: 'https://runwayml.com', description: 'AI视频生成工具', category: 'video' },
        { name: 'Figma AI', url: 'https://www.figma.com', description: 'AI设计工具', category: 'design' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai', description: 'AI搜索引擎', category: 'other' }
      ]
    }
  },
  methods: {
    getCategoryName(category) {
      const names = {
        chat: '💬 对话AI',
        image: '🎨 图像生成',
        code: '💻 代码助手',
        writing: '✍️ 写作助手',
        video: '🎬 视频生成',
        design: '🎨 设计工具',
        search: '🔍 搜索引擎',
        audio: '🎵 音频工具',
        navigation: '🗺️ 导航集合'
      }
      return names[category] || category
    },
    toggleCategory(category) {
      // Vue 3 中可以直接设置对象属性，不需要 $set
      this.collapsedCategories[category] = !this.collapsedCategories[category]
    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.ai-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 3rem;
}

.page-header {
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 25%, #3a8a7a 50%, #8b6f47 75%, #a67c52 100%);
  color: white;
  padding: 4rem 1rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.page-header::before {
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

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.02em;
}

.page-description {
  font-size: 1.2rem;
  opacity: 0.95;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 搜索和筛选栏 */
.search-filter-bar {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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
  padding: 1.2rem 1.2rem 1.2rem 3.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: #2d7a6b;
  box-shadow: 0 0 0 4px rgba(45, 122, 107, 0.1);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tag {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
}

.filter-tag:hover {
  border-color: #2d7a6b;
  color: #2d7a6b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.2);
}

.filter-tag.active {
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5a4f;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

/* 网站分类展示 */
.websites-display {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.category-section {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.category-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.category-header:hover {
  padding-left: 0.5rem;
}

.category-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collapse-icon {
  font-size: 1rem;
  color: #2d7a6b;
  transition: transform 0.3s ease;
  display: inline-block;
}

.category-section.collapsed .collapse-icon {
  transform: rotate(-90deg);
}

.websites-grid {
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 5000px;
  opacity: 1;
}

.category-section.collapsed .websites-grid {
  max-height: 0;
  opacity: 0;
  margin: 0;
}

.category-count {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  padding: 0.4rem 1rem;
  border-radius: 20px;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.website-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 1.75rem;
  border-radius: 16px;
  border: 2px solid #e0e0e0;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

.website-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(45, 122, 107, 0.25);
  border-color: #2d7a6b;
}

.website-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.website-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #fee;
  color: #c33;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  flex-shrink: 0;
}

.delete-btn:hover {
  opacity: 1;
  background: #fcc;
  transform: scale(1.15) rotate(90deg);
}

.website-desc {
  font-size: 0.95rem;
  color: #666;
  margin: 0.75rem 0 1.25rem 0;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.website-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.website-link {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.website-link:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 16px rgba(45, 122, 107, 0.4);
}

.website-category-badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  background: rgba(45, 122, 107, 0.1);
  color: #2d7a6b;
  border-radius: 12px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.75rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.empty-desc {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
  font-weight: 600;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border-left: 4px solid #2d7a6b;
}

.toast.success {
  border-left-color: #2d7a6b;
  color: #2d5a4f;
}

.toast.error {
  border-left-color: #c33;
  color: #c33;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .websites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
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

  .websites-grid {
    grid-template-columns: 1fr;
  }

  .category-section {
    padding: 1.5rem;
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
    padding: 1.25rem;
  }

  .filter-tag {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .website-card {
    padding: 1.5rem;
  }

  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    transform: none;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(100px);
  }
}
</style>
