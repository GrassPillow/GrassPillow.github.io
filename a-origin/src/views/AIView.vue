<template>
  <div class="ai-view">
    <header class="page-header">
      <h1 class="page-title">AI工具集</h1>
      <p class="page-description">提供多种实用的AI工具，提升您的工作效率</p>
    </header>

    <main class="main-content">
      <!-- AI网站列表（默认显示） -->
      <div v-if="showWebsitesList" class="websites-list-section">
        <div class="list-header">
          <div>
            <h2 class="list-title">AI网站收集</h2>
            <p class="list-subtitle">发现和收藏优秀的AI工具网站</p>
          </div>
          <button class="back-btn" @click="showWebsitesList = false">
            <span>←</span> 返回工具
          </button>
        </div>

        <!-- 搜索和筛选 -->
        <div class="search-filter-bar">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索AI网站..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
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
        
        <!-- 添加网站表单（可折叠） -->
        <div class="add-website-form" :class="{ collapsed: !showAddForm }">
          <div class="form-header" @click="showAddForm = !showAddForm">
            <h3 class="section-title">
              <span>{{ showAddForm ? '−' : '+' }}</span>
              添加AI网站
            </h3>
          </div>
          <div v-show="showAddForm" class="form-content">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">网站名称 *</label>
                <input
                  v-model="newWebsite.name"
                  type="text"
                  placeholder="例如：ChatGPT"
                  class="form-input"
                  @keyup.enter="addWebsite"
                />
              </div>
              <div class="form-group">
                <label class="form-label">网站URL *</label>
                <input
                  v-model="newWebsite.url"
                  type="url"
                  placeholder="https://example.com"
                  class="form-input"
                  @keyup.enter="addWebsite"
                />
              </div>
              <div class="form-group">
                <label class="form-label">网站描述</label>
                <input
                  v-model="newWebsite.description"
                  type="text"
                  placeholder="简短描述（可选）"
                  class="form-input"
                  @keyup.enter="addWebsite"
                />
              </div>
              <div class="form-group">
                <label class="form-label">分类</label>
                <select v-model="newWebsite.category" class="form-select">
                  <option value="chat">💬 对话AI</option>
                  <option value="image">🎨 图像生成</option>
                  <option value="video">🎬 视频生成</option>
                  <option value="code">💻 代码助手</option>
                  <option value="writing">✍️ 写作助手</option>
                  <option value="design">🎨 设计工具</option>
                  <option value="other">🔧 其他</option>
                </select>
              </div>
            </div>
            <button class="action-btn" @click="addWebsite">
              <span>+</span> 添加网站
            </button>
          </div>
        </div>

        <!-- 网站统计 -->
        <div class="stats-bar" v-if="filteredCategorizedWebsites">
          <span class="stat-item">
            <strong>{{ filteredWebsitesCount }}</strong> 个网站
          </span>
          <span class="stat-item">
            <strong>{{ filteredCategoriesCount }}</strong> 个分类
          </span>
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
            >
              <h3 class="category-title">
                {{ getCategoryName(category) }}
                <span class="category-count">({{ sites.length }})</span>
              </h3>
              <div class="websites-grid">
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
                  <button
                    class="delete-btn"
                    @click="removeWebsite(category, index)"
                    title="删除"
                  >
                    ✕
                  </button>
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
          <p class="empty-desc">尝试调整搜索条件或添加新网站</p>
        </div>
      </div>

      <!-- 工具卡片网格 -->
      <div v-show="!showWebsitesList" class="tools-grid">
        <!-- 文本摘要工具 -->
        <div class="tool-card" @click="openTool('summary')">
          <div class="tool-icon">📝</div>
          <h3 class="tool-title">文本摘要</h3>
          <p class="tool-desc">快速提取文本关键信息，生成简洁摘要</p>
        </div>

        <!-- 文本翻译工具 -->
        <div class="tool-card" @click="openTool('translate')">
          <div class="tool-icon">🌐</div>
          <h3 class="tool-title">文本翻译</h3>
          <p class="tool-desc">多语言文本翻译，支持多种语言互译</p>
        </div>

        <!-- 文本生成工具 -->
        <div class="tool-card" @click="openTool('generate')">
          <div class="tool-icon">✨</div>
          <h3 class="tool-title">文本生成</h3>
          <p class="tool-desc">根据提示词生成文本内容</p>
        </div>

        <!-- 代码格式化工具 -->
        <div class="tool-card" @click="openTool('format')">
          <div class="tool-icon">💻</div>
          <h3 class="tool-title">代码格式化</h3>
          <p class="tool-desc">美化代码格式，提高代码可读性</p>
        </div>

        <!-- 密码生成器 -->
        <div class="tool-card" @click="openTool('password')">
          <div class="tool-icon">🔐</div>
          <h3 class="tool-title">密码生成器</h3>
          <p class="tool-desc">生成安全可靠的随机密码</p>
        </div>

        <!-- 二维码生成器 -->
        <div class="tool-card" @click="openTool('qrcode')">
          <div class="tool-icon">📱</div>
          <h3 class="tool-title">二维码生成</h3>
          <p class="tool-desc">将文本或链接转换为二维码</p>
        </div>

        <!-- JSON格式化工具 -->
        <div class="tool-card" @click="openTool('json')">
          <div class="tool-icon">📋</div>
          <h3 class="tool-title">JSON格式化</h3>
          <p class="tool-desc">格式化JSON数据，验证JSON格式</p>
        </div>

        <!-- 颜色提取工具 -->
        <div class="tool-card" @click="openTool('color')">
          <div class="tool-icon">🎨</div>
          <h3 class="tool-title">颜色提取</h3>
          <p class="tool-desc">从图片中提取主要颜色</p>
        </div>

        <!-- AI网站收集 -->
        <div class="tool-card" @click="showWebsitesList = true">
          <div class="tool-icon">🌐</div>
          <h3 class="tool-title">AI网站收集</h3>
          <p class="tool-desc">收集和展示优秀的AI工具网站</p>
        </div>
      </div>

      <!-- 工具面板 -->
      <div v-if="activeTool" class="tool-panel">
        <div class="panel-header">
          <h2 class="panel-title">{{ getToolTitle() }}</h2>
          <button class="close-btn" @click="closeTool">✕</button>
        </div>

        <div class="panel-content">
          <!-- 文本摘要工具 -->
          <div v-if="activeTool === 'summary'" class="tool-content">
            <div class="input-section">
              <label class="input-label">输入文本</label>
              <textarea
                v-model="summaryInput"
                class="text-input"
                rows="8"
                placeholder="请输入需要摘要的文本..."
              ></textarea>
              <button class="action-btn" @click="generateSummary">生成摘要</button>
            </div>
            <div v-if="summaryOutput" class="output-section">
              <label class="output-label">摘要结果</label>
              <div class="output-content">{{ summaryOutput }}</div>
            </div>
          </div>

          <!-- 文本翻译工具 -->
          <div v-if="activeTool === 'translate'" class="tool-content">
            <div class="input-section">
              <div class="lang-selector">
                <select v-model="translateFrom" class="lang-select">
                  <option value="auto">自动检测</option>
                  <option value="zh">中文</option>
                  <option value="en">英语</option>
                  <option value="ja">日语</option>
                  <option value="ko">韩语</option>
                  <option value="fr">法语</option>
                  <option value="es">西班牙语</option>
                </select>
                <span class="arrow">→</span>
                <select v-model="translateTo" class="lang-select">
                  <option value="zh">中文</option>
                  <option value="en">英语</option>
                  <option value="ja">日语</option>
                  <option value="ko">韩语</option>
                  <option value="fr">法语</option>
                  <option value="es">西班牙语</option>
                </select>
              </div>
              <textarea
                v-model="translateInput"
                class="text-input"
                rows="6"
                placeholder="请输入要翻译的文本..."
              ></textarea>
              <button class="action-btn" @click="translateText">翻译</button>
            </div>
            <div v-if="translateOutput" class="output-section">
              <label class="output-label">翻译结果</label>
              <div class="output-content">{{ translateOutput }}</div>
            </div>
          </div>

          <!-- 文本生成工具 -->
          <div v-if="activeTool === 'generate'" class="tool-content">
            <div class="input-section">
              <label class="input-label">提示词</label>
              <textarea
                v-model="generatePrompt"
                class="text-input"
                rows="4"
                placeholder="请输入提示词，例如：写一首关于春天的诗"
              ></textarea>
              <button class="action-btn" @click="generateText">生成文本</button>
            </div>
            <div v-if="generateOutput" class="output-section">
              <label class="output-label">生成结果</label>
              <div class="output-content">{{ generateOutput }}</div>
            </div>
          </div>

          <!-- 代码格式化工具 -->
          <div v-if="activeTool === 'format'" class="tool-content">
            <div class="input-section">
              <label class="input-label">选择语言</label>
              <select v-model="codeLanguage" class="lang-select">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
              <label class="input-label">输入代码</label>
              <textarea
                v-model="codeInput"
                class="text-input code-input"
                rows="10"
                placeholder="请输入需要格式化的代码..."
              ></textarea>
              <button class="action-btn" @click="formatCode">格式化</button>
            </div>
            <div v-if="codeOutput" class="output-section">
              <label class="output-label">格式化结果</label>
              <pre class="output-content code-output"><code>{{ codeOutput }}</code></pre>
            </div>
          </div>

          <!-- 密码生成器 -->
          <div v-if="activeTool === 'password'" class="tool-content">
            <div class="input-section">
              <div class="password-options">
                <label class="option-label">
                  <span>密码长度：</span>
                  <input type="number" v-model.number="passwordLength" min="4" max="50" class="number-input">
                </label>
                <label class="option-label">
                  <input type="checkbox" v-model="passwordOptions.uppercase"> 大写字母
                </label>
                <label class="option-label">
                  <input type="checkbox" v-model="passwordOptions.lowercase"> 小写字母
                </label>
                <label class="option-label">
                  <input type="checkbox" v-model="passwordOptions.numbers"> 数字
                </label>
                <label class="option-label">
                  <input type="checkbox" v-model="passwordOptions.symbols"> 特殊字符
                </label>
              </div>
              <button class="action-btn" @click="generatePassword">生成密码</button>
            </div>
            <div v-if="passwordOutput" class="output-section">
              <label class="output-label">生成的密码</label>
              <div class="password-display">
                <input type="text" :value="passwordOutput" readonly class="password-input">
                <button class="copy-btn" @click="copyToClipboard(passwordOutput)">复制</button>
              </div>
            </div>
          </div>

          <!-- 二维码生成器 -->
          <div v-if="activeTool === 'qrcode'" class="tool-content">
            <div class="input-section">
              <label class="input-label">输入内容</label>
              <textarea
                v-model="qrcodeInput"
                class="text-input"
                rows="4"
                placeholder="请输入文本或链接..."
              ></textarea>
              <button class="action-btn" @click="generateQRCode">生成二维码</button>
            </div>
            <div v-if="qrcodeOutput" class="output-section">
              <label class="output-label">二维码</label>
              <div class="qrcode-container">
                <canvas ref="qrcodeCanvas" class="qrcode-canvas"></canvas>
                <button class="download-btn" @click="downloadQRCode">下载</button>
              </div>
            </div>
          </div>

          <!-- JSON格式化工具 -->
          <div v-if="activeTool === 'json'" class="tool-content">
            <div class="input-section">
              <textarea
                v-model="jsonInput"
                class="text-input code-input"
                rows="10"
                placeholder="请输入JSON数据..."
              ></textarea>
              <button class="action-btn" @click="formatJSON">格式化</button>
            </div>
            <div v-if="jsonOutput" class="output-section">
              <label class="output-label">格式化结果</label>
              <pre class="output-content code-output"><code>{{ jsonOutput }}</code></pre>
            </div>
            <div v-if="jsonError" class="error-message">
              {{ jsonError }}
            </div>
          </div>

          <!-- 颜色提取工具 -->
          <div v-if="activeTool === 'color'" class="tool-content">
            <div class="input-section">
              <label class="input-label">上传图片</label>
              <input type="file" @change="handleImageUpload" accept="image/*" class="file-input">
              <div v-if="colorImageUrl" class="image-preview">
                <img :src="colorImageUrl" alt="预览" class="preview-image">
              </div>
              <button v-if="colorImageUrl" class="action-btn" @click="extractColors">提取颜色</button>
            </div>
            <div v-if="extractedColors.length > 0" class="output-section">
              <label class="output-label">提取的颜色</label>
              <div class="colors-grid">
                <div
                  v-for="(color, index) in extractedColors"
                  :key="index"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="copyToClipboard(color)"
                >
                  <span class="color-value">{{ color }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
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
export default {
  name: 'AIView',
  data() {
    return {
      activeTool: null,
      showWebsitesList: true,
      // 文本摘要
      summaryInput: '',
      summaryOutput: '',
      // 文本翻译
      translateInput: '',
      translateOutput: '',
      translateFrom: 'auto',
      translateTo: 'zh',
      // 文本生成
      generatePrompt: '',
      generateOutput: '',
      // 代码格式化
      codeInput: '',
      codeOutput: '',
      codeLanguage: 'javascript',
      // 密码生成
      passwordLength: 16,
      passwordOptions: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
      },
      passwordOutput: '',
      // 二维码
      qrcodeInput: '',
      qrcodeOutput: null,
      qrcodeCanvas: null,
      // JSON格式化
      jsonInput: '',
      jsonOutput: '',
      jsonError: '',
      // 颜色提取
      colorImageUrl: '',
      extractedColors: [],
      // AI网站收集
      aiWebsites: [
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
      ],
      newWebsite: {
        name: '',
        url: '',
        description: '',
        category: 'chat'
      },
      searchQuery: '',
      selectedCategory: '',
      showAddForm: false,
      categories: [
        { value: 'all', label: '全部' },
        { value: 'chat', label: '💬 对话AI' },
        { value: 'image', label: '🎨 图像生成' },
        { value: 'video', label: '🎬 视频生成' },
        { value: 'code', label: '💻 代码助手' },
        { value: 'writing', label: '✍️ 写作助手' },
        { value: 'design', label: '🎨 设计工具' },
        { value: 'other', label: '🔧 其他' }
      ],
      toastMessage: '',
      showToast: false,
      toastType: 'success'
    }
  },
  computed: {
    categorizedWebsites() {
      if (!this.aiWebsites || !Array.isArray(this.aiWebsites)) {
        return {}
      }
      const categories = {}
      this.aiWebsites.forEach(site => {
        if (site && site.category) {
          if (!categories[site.category]) {
            categories[site.category] = []
          }
          categories[site.category].push(site)
        }
      })
      return categories
    },
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
  mounted() {
    // 从本地存储加载保存的网站
    const saved = localStorage.getItem('aiWebsites')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          this.aiWebsites = parsed
        }
      } catch (e) {
        console.error('Failed to load saved websites:', e)
      }
    }
  },
  methods: {
    openTool(toolName) {
      this.activeTool = toolName
      this.resetToolData(toolName)
    },
    closeTool() {
      this.activeTool = null
    },
    resetToolData(toolName) {
      // 重置各个工具的数据
      if (toolName === 'summary') {
        this.summaryInput = ''
        this.summaryOutput = ''
      } else if (toolName === 'translate') {
        this.translateInput = ''
        this.translateOutput = ''
      } else if (toolName === 'generate') {
        this.generatePrompt = ''
        this.generateOutput = ''
      } else if (toolName === 'format') {
        this.codeInput = ''
        this.codeOutput = ''
      } else if (toolName === 'password') {
        this.passwordOutput = ''
      } else if (toolName === 'qrcode') {
        this.qrcodeInput = ''
        this.qrcodeOutput = null
      } else if (toolName === 'json') {
        this.jsonInput = ''
        this.jsonOutput = ''
        this.jsonError = ''
      } else if (toolName === 'color') {
        this.colorImageUrl = ''
        this.extractedColors = []
      } else if (toolName === 'websites') {
        // 不需要重置
      }
    },
    getToolTitle() {
      const titles = {
        summary: '文本摘要',
        translate: '文本翻译',
        generate: '文本生成',
        format: '代码格式化',
        password: '密码生成器',
        qrcode: '二维码生成',
        json: 'JSON格式化',
        color: '颜色提取',
        websites: 'AI网站收集'
      }
      return titles[this.activeTool] || 'AI工具'
    },
    getCategoryName(category) {
      const names = {
        chat: '💬 对话AI',
        image: '🎨 图像生成',
        video: '🎬 视频生成',
        code: '💻 代码助手',
        writing: '✍️ 写作助手',
        design: '🎨 设计工具',
        other: '🔧 其他工具'
      }
      return names[category] || category
    },
    addWebsite() {
      if (!this.newWebsite.name.trim() || !this.newWebsite.url.trim()) {
        this.showToastMessage('请填写网站名称和URL', 'error')
        return
      }
      
      // 验证URL格式
      let url = this.newWebsite.url.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      
      try {
        new URL(url)
      } catch (e) {
        this.showToastMessage('请输入有效的URL', 'error')
        return
      }
      
      // 检查是否已存在
      const exists = this.aiWebsites.some(site => 
        site.url === url || site.name.toLowerCase() === this.newWebsite.name.trim().toLowerCase()
      )
      
      if (exists) {
        this.showToastMessage('该网站已存在', 'error')
        return
      }
      
      this.aiWebsites.push({
        name: this.newWebsite.name.trim(),
        url: url,
        description: this.newWebsite.description.trim(),
        category: this.newWebsite.category
      })
      
      // 保存到本地存储
      localStorage.setItem('aiWebsites', JSON.stringify(this.aiWebsites))
      
      // 重置表单
      this.newWebsite = {
        name: '',
        url: '',
        description: '',
        category: 'chat'
      }
      
      this.showAddForm = false
      this.showToastMessage('网站添加成功！', 'success')
    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
    removeWebsite(category, index) {
      if (confirm('确定要删除这个网站吗？')) {
        const sites = this.filteredCategorizedWebsites[category]
        const site = sites[index]
        const globalIndex = this.aiWebsites.findIndex(s => 
          s.name === site.name && s.url === site.url
        )
        if (globalIndex !== -1) {
          this.aiWebsites.splice(globalIndex, 1)
          localStorage.setItem('aiWebsites', JSON.stringify(this.aiWebsites))
          this.showToastMessage('网站已删除', 'success')
        }
      }
    },
    generateSummary() {
      if (!this.summaryInput.trim()) {
        alert('请输入要摘要的文本')
        return
      }
      // 简单的文本摘要算法（提取前几句和关键词）
      const sentences = this.summaryInput.split(/[。！？.!?]/).filter(s => s.trim())
      const summary = sentences.slice(0, Math.min(3, sentences.length)).join('。')
      this.summaryOutput = summary || this.summaryInput.substring(0, 200) + '...'
    },
    async translateText() {
      if (!this.translateInput.trim()) {
        alert('请输入要翻译的文本')
        return
      }
      // 使用免费的翻译API（这里使用简单的示例，实际可以使用Google Translate API或其他服务）
      try {
        // 注意：这里使用一个简单的翻译服务示例
        // 实际项目中可以使用Google Translate API或其他翻译服务
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(this.translateInput)}&langpair=${this.translateFrom}|${this.translateTo}`)
        const data = await response.json()
        if (data.responseData && data.responseData.translatedText) {
          this.translateOutput = data.responseData.translatedText
        } else {
          this.translateOutput = '翻译失败，请稍后重试'
        }
      } catch (error) {
        this.translateOutput = '翻译服务暂时不可用，请稍后重试'
        console.error('Translation error:', error)
      }
    },
    generateText() {
      if (!this.generatePrompt.trim()) {
        alert('请输入提示词')
        return
      }
      // 简单的文本生成（实际项目中可以集成OpenAI API或其他AI服务）
      const templates = {
        '诗': '春风拂面花满枝，\n绿意盎然鸟语时。\n万物复苏生机现，\n美好时光正当时。',
        '文章': `根据您的要求"${this.generatePrompt}"，以下是相关内容：\n\n这是一个示例文本生成。在实际应用中，您可以集成OpenAI、Claude等AI服务来生成更高质量的内容。`,
        'default': `根据提示"${this.generatePrompt}"，以下是生成的内容：\n\n这是一个示例文本。在实际项目中，建议集成专业的AI文本生成服务以获得更好的效果。`
      }
      
      if (this.generatePrompt.includes('诗')) {
        this.generateOutput = templates['诗']
      } else if (this.generatePrompt.includes('文章')) {
        this.generateOutput = templates['文章']
      } else {
        this.generateOutput = templates['default']
      }
    },
    formatCode() {
      if (!this.codeInput.trim()) {
        alert('请输入要格式化的代码')
        return
      }
      try {
        if (this.codeLanguage === 'json') {
          const parsed = JSON.parse(this.codeInput)
          this.codeOutput = JSON.stringify(parsed, null, 2)
        } else {
          // 简单的代码格式化（实际可以使用Prettier等工具）
          this.codeOutput = this.codeInput
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n')
        }
      } catch (error) {
        alert('代码格式化失败：' + error.message)
      }
    },
    generatePassword() {
      let charset = ''
      if (this.passwordOptions.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (this.passwordOptions.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (this.passwordOptions.numbers) charset += '0123456789'
      if (this.passwordOptions.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
      
      if (!charset) {
        alert('请至少选择一种字符类型')
        return
      }
      
      let password = ''
      for (let i = 0; i < this.passwordLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      this.passwordOutput = password
    },
    generateQRCode() {
      if (!this.qrcodeInput.trim()) {
        alert('请输入要生成二维码的内容')
        return
      }
      // 使用在线二维码API生成
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.qrcodeInput)}`
      this.qrcodeOutput = qrUrl
      
      // 在canvas上绘制二维码
      this.$nextTick(() => {
        const canvas = this.$refs.qrcodeCanvas
        if (canvas) {
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            canvas.width = 300
            canvas.height = 300
            ctx.drawImage(img, 0, 0)
          }
          img.src = qrUrl
        }
      })
    },
    downloadQRCode() {
      if (!this.qrcodeOutput) return
      const canvas = this.$refs.qrcodeCanvas
      if (canvas) {
        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = canvas.toDataURL()
        link.click()
      }
    },
    formatJSON() {
      if (!this.jsonInput.trim()) {
        alert('请输入JSON数据')
        return
      }
      try {
        const parsed = JSON.parse(this.jsonInput)
        this.jsonOutput = JSON.stringify(parsed, null, 2)
        this.jsonError = ''
      } catch (error) {
        this.jsonError = 'JSON格式错误：' + error.message
        this.jsonOutput = ''
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.colorImageUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    extractColors() {
      if (!this.colorImageUrl) return
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        // 简单的颜色提取算法（提取主要颜色）
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = {}
        const sampleSize = 1000 // 采样数量
        
        for (let i = 0; i < sampleSize; i++) {
          const index = Math.floor(Math.random() * imageData.data.length / 4) * 4
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]
          const color = `rgb(${r}, ${g}, ${b})`
          colors[color] = (colors[color] || 0) + 1
        }
        
        // 获取最常见的几种颜色
        const sortedColors = Object.entries(colors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([color]) => color)
        
        this.extractedColors = sortedColors
      }
      img.src = this.colorImageUrl
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('已复制到剪贴板')
      }).catch(() => {
        // 备用方案
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert('已复制到剪贴板')
      })
    }
  }
}
</script>

<style scoped>
.ai-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 2rem;
}

.page-header {
  background: linear-gradient(135deg, #2d7a6b 0%, #2d7a6b 50%, #8b6f47 50%, #8b6f47 100%);
  color: white;
  text-align: center;
  padding: 3rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.page-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tool-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.3);
  border-color: #2d7a6b;
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tool-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.tool-desc {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.tool-panel {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.panel-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-label,
.output-label {
  font-size: 1rem;
  font-weight: 600;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.text-input:focus {
  outline: none;
  border-color: #2d7a6b;
}

.code-input {
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.9rem;
}

.action-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(45, 122, 107, 0.4);
}

.output-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

.code-output {
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.9rem;
}

.lang-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang-select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.arrow {
  font-size: 1.5rem;
  color: #2d7a6b;
  font-weight: 600;
}

.password-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.password-display {
  display: flex;
  gap: 1rem;
}

.password-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  text-align: center;
}

.copy-btn,
.download-btn {
  padding: 1rem 1.5rem;
  background: #2d7a6b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover,
.download-btn:hover {
  background: #1e5a4a;
  transform: translateY(-2px);
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qrcode-canvas {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
}

.file-input {
  padding: 1rem;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.image-preview {
  margin-top: 1rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.color-item {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.color-item:hover {
  transform: scale(1.1);
}

.color-value {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
}

.error-message {
  padding: 1rem;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  border: 1px solid #fcc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* AI网站收集样式 */
.websites-list-section {
  animation: fadeIn 0.3s ease;
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

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.list-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.list-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(45, 122, 107, 0.4);
}

/* 搜索和筛选栏 */
.search-filter-bar {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: #2d7a6b;
  box-shadow: 0 0 0 3px rgba(45, 122, 107, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.filter-tag:hover {
  border-color: #2d7a6b;
  color: #2d7a6b;
}

.filter-tag.active {
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  border-color: transparent;
  color: white;
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.stat-item {
  color: #666;
  font-size: 0.95rem;
}

.stat-item strong {
  color: #2d5a4f;
  font-weight: 700;
  margin-right: 0.25rem;
}

.websites-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.add-website-form {
  background: white;
  border-radius: 16px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.add-website-form.collapsed {
  border-color: #e0e0e0;
}

.form-header {
  padding: 1.5rem 2rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.form-header:hover {
  background-color: #f8f9fa;
}

.form-header .section-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-header .section-title span {
  font-size: 1.5rem;
  font-weight: 300;
  width: 24px;
  display: inline-block;
  text-align: center;
}

.form-content {
  padding: 0 2rem 2rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d5a4f;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 1.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #2d7a6b;
}

.websites-display {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-count {
  font-size: 1rem;
  font-weight: 400;
  color: #999;
}

.websites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.website-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
}

.website-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(45, 122, 107, 0.2);
  border-color: #2d7a6b;
}

.website-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.website-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #fee;
  color: #c33;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  background: #fcc;
  transform: scale(1.1);
}

.website-desc {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
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
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.website-link:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

.website-category-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  color: #666;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.empty-desc {
  font-size: 1rem;
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
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .tool-card {
    padding: 1.5rem;
  }

  .tool-icon {
    font-size: 2.5rem;
  }

  .tool-title {
    font-size: 1.1rem;
  }

  .tool-desc {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }

  .lang-selector {
    flex-direction: column;
  }

  .arrow {
    transform: rotate(90deg);
  }

  .websites-grid {
    grid-template-columns: 1fr;
  }

  .add-website-form {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .websites-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .list-title {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .add-website-form {
    padding: 1.5rem;
  }
}
</style>

