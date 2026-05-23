<template>
  <div class="post-detail-view">
    <div class="post-container">
      <div class="post-header">
        <div class="post-meta">
          <span class="post-category">{{ getCategoryName(post.categoryId) }}</span>
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-author-info">
          <div class="author-avatar">
            <img src="https://picsum.photos/seed/avatar/100/100.jpg" alt="作者头像" />
          </div>
          <div class="author-details">
            <div class="author-name">{{ post.author }}</div>
            <div class="post-stats">
              <span class="post-views">👁 {{ post.views }} 阅读</span>
              <span class="post-likes">👍 {{ post.likes }} 赞</span>
              <span class="post-comments">💬 {{ post.comments }} 评论</span>
            </div>
          </div>
        </div>
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
      </div>

      <div class="post-cover" v-if="post.coverImage">
        <img :src="post.coverImage" :alt="post.title" />
      </div>

      <!-- Article Content with TOC -->
      <div class="post-body">
        <div class="post-content" ref="contentRef" v-html="post.content"></div>

        <!-- Table of Contents Sidebar -->
        <aside class="toc-sidebar" :class="{ 'toc-fixed': isTocFixed }">
          <div class="toc-container">
            <h4 class="toc-title">目录</h4>
            <nav class="toc-nav">
              <a
                v-for="item in tocItems"
                :key="item.id"
                :href="'#' + item.id"
                class="toc-item"
                :class="{ active: activeTocId === item.id }"
                :style="{ paddingLeft: (item.level - 1) * 12 + 'px' }"
                @click.prevent="scrollToHeading(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </aside>
      </div>

      <div class="post-actions">
        <button class="action-button like-button" @click="toggleLike">
          <span class="action-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
          <span class="action-text">{{ isLiked ? '已赞' : '点赞' }}</span>
          <span class="action-count">({{ post.likes }})</span>
        </button>
        <button class="action-button share-button" @click="showShareMenu = !showShareMenu">
          <span class="action-icon">📤</span>
          <span class="action-text">分享</span>
        </button>
        <div class="share-menu" v-if="showShareMenu">
          <button class="share-option" @click="shareToWeibo">
            <span class="share-icon">📝</span>
            分享到微博
          </button>
          <button class="share-option" @click="copyLink">
            <span class="share-icon">🔗</span>
            复制链接
          </button>
        </div>
      </div>

      <div class="post-navigation">
        <router-link 
          v-if="prevPost" 
          :to="`/blog/post/${prevPost.id}`" 
          class="nav-link prev-link"
        >
          <span class="nav-direction">← 上一篇</span>
          <span class="nav-title">{{ prevPost.title }}</span>
        </router-link>
        <router-link 
          v-if="nextPost" 
          :to="`/blog/post/${nextPost.id}`" 
          class="nav-link next-link"
        >
          <span class="nav-direction">下一篇 →</span>
          <span class="nav-title">{{ nextPost.title }}</span>
        </router-link>
      </div>
    </div>

    <CommentSection
      :comments="comments"
      :totalComments="post.comments"
      @submit-comment="submitComment"
      @like-comment="likeComment"
      @reply-comment="replyToComment"
      @like-reply="likeReply"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()

// 响应式数据
const postId = ref(parseInt(route.params.id))
const isLiked = ref(false)
const showShareMenu = ref(false)
const newComment = ref('')
const contentRef = ref(null)
const tocItems = ref([])
const activeTocId = ref('')
const isTocFixed = ref(false)

// 解析文章内容生成目录
const generateToc = () => {
  if (!contentRef.value) return

  const headings = contentRef.value.querySelectorAll('h2, h3')
  const items = []

  headings.forEach((heading, index) => {
    const id = `heading-${index}`
    heading.id = id

    items.push({
      id,
      text: heading.textContent,
      level: parseInt(heading.tagName.replace('H', ''))
    })
  })

  tocItems.value = items
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })

    activeTocId.value = id
  }
}

// 监听滚动更新目录高亮
const handleScroll = () => {
  // 更新目录固定状态
  isTocFixed.value = window.scrollY > 400

  // 更新当前高亮的目录项
  const headings = tocItems.value.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(item => item.element)

  for (let i = headings.length - 1; i >= 0; i--) {
    const rect = headings[i].element.getBoundingClientRect()
    if (rect.top <= 150) {
      activeTocId.value = headings[i].id
      break
    }
  }
}

// 模拟文章数据
const posts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    content: `
      <h2>什么是 Composition API？</h2>
      <p>Composition API 是 Vue 3 中引入的一种新的组件逻辑组织方式，它提供了一套基于函数的 API，允许我们更灵活地组织组件逻辑。</p>
      
      <h2>为什么需要 Composition API？</h2>
      <p>在 Vue 2 中，我们主要通过 Options API 来组织组件逻辑。随着组件功能的增加，Options API 的一些局限性逐渐显现：</p>
      <ul>
        <li>相关逻辑分散在不同选项中，难以维护</li>
        <li>复用逻辑需要使用 mixins，可能导致命名冲突</li>
        <li>对 TypeScript 的支持有限</li>
      </ul>
      
      <h2>Composition API 的核心概念</h2>
      
      <h3>1. setup() 函数</h3>
      <p>setup() 函数是 Composition API 的入口点，它在组件创建之前执行，用于初始化组件的状态和逻辑。</p>
      <pre><code>import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({ name: 'Vue 3' })
    
    return {
      count,
      state
    }
  }
}</code></pre>
      
      <h3>2. 响应式引用</h3>
      <p>Composition API 提供了两种创建响应式数据的方式：ref() 和 reactive()。</p>
      <ul>
        <li><strong>ref()</strong>：用于创建基本类型的响应式引用</li>
        <li><strong>reactive()</strong>：用于创建对象类型的响应式代理</li>
      </ul>
      
      <h3>3. 计算属性和侦听器</h3>
      <p>Composition API 中的计算属性和侦听器通过 computed() 和 watch() 函数创建。</p>
      <pre><code>import { ref, computed, watch } from 'vue'

export default {
  setup() {
    const firstName = ref('John')
    const lastName = ref('Doe')
    
    const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`)
    
    watch(firstName, (newVal, oldVal) => {
      console.log(\`firstName changed from \${oldVal} to \${newVal}\`)
    })
    
    return {
      firstName,
      lastName,
      fullName
    }
  }
}</code></pre>
      
      <h2>Composition API 的优势</h2>
      <ul>
        <li>更好的逻辑组织：相关逻辑可以组织在一起</li>
        <li>更灵活的代码复用：通过组合函数实现逻辑复用</li>
        <li>更好的 TypeScript 支持：类型推断更准确</li>
        <li>更小的包体积：按需引入，tree-shaking 更友好</li>
      </ul>
      
      <h2>总结</h2>
      <p>Composition API 为 Vue 3 带来了更强大、更灵活的组件逻辑组织方式。它不仅解决了 Options API 的一些局限性，还为 Vue 生态系统带来了新的可能性。虽然学习曲线可能稍陡，但掌握 Composition API 将大大提升你的 Vue 开发体验。</p>
    `,
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 2],
    coverImage: 'https://picsum.photos/seed/vue3/1200/600.jpg',
    createdAt: new Date('2025-01-05'),
    views: 1250,
    likes: 42,
    comments: 8
  },
  {
    id: 2,
    title: '现代前端开发工具链配置指南',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 3],
    coverImage: 'https://picsum.photos/seed/frontend/1200/600.jpg',
    createdAt: new Date('2025-01-03'),
    views: 980,
    likes: 35,
    comments: 5
  },
  {
    id: 3,
    title: '个人博客搭建全记录',
    content: '...',
    author: 'GrassPillow',
    categoryId: 2,
    tagIds: [2, 4],
    coverImage: 'https://picsum.photos/seed/blog/1200/600.jpg',
    createdAt: new Date('2025-01-01'),
    views: 2100,
    likes: 68,
    comments: 12
  }
])

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    author: '张三',
    avatar: 'https://picsum.photos/seed/user1/100/100.jpg',
    content: '非常详细的文章，对 Composition API 的解释很透彻！',
    createdAt: new Date('2025-01-06'),
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: 'GrassPillow',
        avatar: 'https://picsum.photos/seed/avatar/100/100.jpg',
        content: '谢谢你的认可！很高兴这篇文章对你有帮助。',
        createdAt: new Date('2025-01-06'),
        likes: 2,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    author: '李四',
    avatar: 'https://picsum.photos/seed/user2/100/100.jpg',
    content: '我在实际项目中使用了 Composition API，确实比 Options API 更灵活。但是学习成本有点高，特别是对于新手来说。',
    createdAt: new Date('2025-01-07'),
    likes: 3,
    isLiked: false,
    replies: []
  }
])

// 分类和标签数据
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
const post = computed(() => {
  return posts.value.find(p => p.id === postId.value) || {}
})

const prevPost = computed(() => {
  const index = posts.value.findIndex(p => p.id === postId.value)
  return index > 0 ? posts.value[index - 1] : null
})

const nextPost = computed(() => {
  const index = posts.value.findIndex(p => p.id === postId.value)
  return index < posts.value.length - 1 ? posts.value[index + 1] : null
})

// 方法
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

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    post.value.likes++
  } else {
    post.value.likes--
  }
}

const shareToWeibo = () => {
  const url = window.location.href
  const title = post.value.title
  window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
  showShareMenu.value = false
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('链接已复制到剪贴板')
  showShareMenu.value = false
}

const submitComment = (content) => {
  if (!content.trim()) return

  const comment = {
    id: comments.value.length + 1,
    author: '当前用户',
    avatar: 'https://picsum.photos/seed/currentuser/100/100.jpg',
    content: content,
    createdAt: new Date(),
    likes: 0,
    isLiked: false,
    replies: []
  }

  comments.value.unshift(comment)
  post.value.comments++
}

const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    if (comment.isLiked) {
      comment.likes++
    } else {
      comment.likes--
    }
  }
}

const replyToComment = (commentId) => {
  // 实现回复功能
  console.log('回复评论:', commentId)
}

const likeReply = (replyId) => {
  // 实现回复点赞功能
  console.log('点赞回复:', replyId)
}

// 生命周期
onMounted(() => {
  // 增加浏览量
  post.value.views++

  // 生成目录
  nextTick(() => {
    generateToc()
    if (tocItems.value.length > 0) {
      activeTocId.value = tocItems.value[0].id
    }
  })

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.post-detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-header {
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
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
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  color: #333;
}

.post-author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  color: white;
  font-size: 0.875rem;
}

.post-cover {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: auto;
  display: block;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
}

.post-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  color: #2d7a6b;
}

.post-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  color: #333;
}

.post-content p {
  margin-bottom: 1rem;
}

.post-content ul, .post-content ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.post-content li {
  margin-bottom: 0.5rem;
}

.post-content pre {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.post-content code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.post-content blockquote {
  border-left: 4px solid #2d7a6b;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

/* Post Body with TOC */
.post-body {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Table of Contents Sidebar */
.toc-sidebar {
  width: 200px;
  flex-shrink: 0;
  display: none;
}

.toc-fixed {
  position: fixed;
  top: 80px;
}

.toc-container {
  position: sticky;
  top: 100px;
}

.toc-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-item:hover {
  background: var(--bg-tertiary);
  color: var(--primary-color);
}

.toc-item.active {
  background: var(--primary-color);
  color: #fff;
}

@media (min-width: 1200px) {
  .toc-sidebar {
    display: block;
  }

  .post-content {
    flex: 1;
    max-width: calc(100% - 220px);
  }
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: #f5f5f5;
}

.like-button:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.share-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  margin-top: 0.5rem;
  z-index: 10;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  text-align: left;
}

.share-option:hover {
  background-color: #f5f5f5;
}

.post-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.nav-link {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #f5f5f5;
  border-color: #2d7a6b;
}

.nav-direction {
  font-size: 0.875rem;
  color: #2d7a6b;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.nav-title {
  font-weight: 600;
}

@media (max-width: 768px) {
  .post-detail-view {
    padding: 1rem;
  }
  
  .post-container {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 2rem;
  }
  
  .post-navigation {
    grid-template-columns: 1fr;
  }
  
}
</style>