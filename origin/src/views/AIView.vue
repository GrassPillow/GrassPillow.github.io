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
      // 使用全局 Toast
      if (window.$toast) {
        window.$toast[type](message)
      } else {
        // 降级到本地 Toast
        this.toastMessage = message
        this.toastType = type
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 3000)
      }
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
          this.showToastMessage('加载本地保存的网站失败', 'warning')
        }
      }
      
      if (this.aiWebsites.length > 0) {
        this.showToastMessage(`成功加载 ${this.aiWebsites.length} 个AI网站`, 'success')
      }
    } catch (error) {
      console.error('Failed to load AI websites from CSV:', error)
      this.showToastMessage('加载AI网站数据失败，已使用默认数据', 'error')
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
  }
}
</script>

<style scoped>
.ai-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 30%, #f0f4f8 60%, #f5f7fa 100%);
  padding-bottom: 3rem;
  position: relative;
}

.ai-view::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(45, 122, 107, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 111, 71, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.ai-view > * {
  position: relative;
  z-index: 1;
}

.page-header {
  background: linear-gradient(135deg, #1a5d4e 0%, #2d7a6b 20%, #3a8a7a 40%, #4a9a8a 60%, #8b6f47 80%, #a67c52 100%);
  color: white;
  padding: 5rem 1rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
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
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite reverse;
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
  font-size: 3.8rem;
  font-weight: 900;
  margin: 0 0 1.2rem 0;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.03em;
  animation: fadeInDown 0.8s ease-out;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.3rem;
  opacity: 0.98;
  margin: 0;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  line-height: 1.6;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 搜索和筛选栏 */
.search-filter-bar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              0 4px 16px rgba(45, 122, 107, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideInUp 0.6s ease-out 0.3s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  padding: 1.3rem 1.3rem 1.3rem 3.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 18px;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #2d7a6b;
  box-shadow: 0 0 0 5px rgba(45, 122, 107, 0.15),
              0 4px 16px rgba(45, 122, 107, 0.2);
  background: white;
  transform: translateY(-2px);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-tag {
  padding: 0.85rem 1.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.filter-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(45, 122, 107, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.filter-tag:hover::before {
  width: 300px;
  height: 300px;
}

.filter-tag:hover {
  border-color: #2d7a6b;
  color: #2d7a6b;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(45, 122, 107, 0.25);
  background: white;
}

.filter-tag.active {
  background: linear-gradient(135deg, #2d7a6b 0%, #3a8a7a 50%, #8b6f47 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 6px 20px rgba(45, 122, 107, 0.4),
              0 2px 8px rgba(139, 111, 71, 0.3);
  transform: translateY(-2px);
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2rem;
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 249, 250, 0.98) 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(45, 122, 107, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideInUp 0.6s ease-out 0.4s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.15);
}

.stat-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1.05rem;
  color: #666;
  font-weight: 500;
}

/* 网站分类展示 */
.websites-display {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.category-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              0 4px 16px rgba(45, 122, 107, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.category-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2d7a6b 0%, #3a8a7a 50%, #8b6f47 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.category-section:hover::before {
  transform: scaleX(1);
}

.category-section:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18),
              0 6px 20px rgba(45, 122, 107, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid rgba(240, 240, 240, 0.8);
  cursor: pointer;
  user-select: none;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
  background: rgba(248, 249, 250, 0.5);
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-top: -1.5rem;
}

.category-header:hover {
  padding-left: 2rem;
  background: rgba(248, 249, 250, 0.8);
  border-bottom-color: rgba(45, 122, 107, 0.2);
}

.category-title {
  font-size: 1.9rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d5a4f 0%, #2d7a6b 50%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: -0.01em;
}

.collapse-icon {
  font-size: 1.1rem;
  color: #2d7a6b;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: inline-block;
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(45, 122, 107, 0.1);
  border-radius: 50%;
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
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #2d7a6b 0%, #3a8a7a 50%, #8b6f47 100%);
  padding: 0.5rem 1.2rem;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3),
              0 2px 6px rgba(139, 111, 71, 0.2);
  transition: all 0.3s ease;
}

.category-header:hover .category-count {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(45, 122, 107, 0.4);
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.website-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 2px solid rgba(224, 224, 224, 0.6);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.website-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2d7a6b 0%, #8b6f47 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.website-card:hover::before {
  transform: scaleX(1);
}

.website-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(45, 122, 107, 0.3),
              0 8px 20px rgba(139, 111, 71, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: #2d7a6b;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.website-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.website-name {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d5a4f 0%, #2d7a6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.01em;
  transition: transform 0.3s ease;
}

.website-card:hover .website-name {
  transform: translateX(4px);
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
  padding: 0.7rem 1.4rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #3a8a7a 50%, #8b6f47 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.website-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.website-link:hover::before {
  width: 300px;
  height: 300px;
}

.website-link:hover {
  transform: translateX(6px) scale(1.05);
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.5),
              0 4px 12px rgba(139, 111, 71, 0.3);
}

.website-category-badge {
  font-size: 0.75rem;
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.15) 0%, rgba(139, 111, 71, 0.15) 100%);
  color: #2d7a6b;
  border-radius: 14px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border: 1px solid rgba(45, 122, 107, 0.2);
  transition: all 0.3s ease;
}

.website-card:hover .website-category-badge {
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.25) 0%, rgba(139, 111, 71, 0.25) 100%);
  transform: scale(1.05);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 249, 250, 0.98) 100%);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1),
              0 4px 16px rgba(45, 122, 107, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-icon {
  font-size: 6rem;
  margin-bottom: 2rem;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d5a4f 0%, #2d7a6b 50%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.empty-desc {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Toast 提示 */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1.2rem 1.8rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25),
              0 4px 16px rgba(45, 122, 107, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 700;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border-left: 5px solid #2d7a6b;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.toast.success {
  border-left-color: #2d7a6b;
  color: #2d5a4f;
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.3),
              0 4px 16px rgba(45, 122, 107, 0.2);
}

.toast.error {
  border-left-color: #c33;
  color: #c33;
  box-shadow: 0 12px 32px rgba(204, 51, 51, 0.3),
              0 4px 16px rgba(204, 51, 51, 0.2);
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
