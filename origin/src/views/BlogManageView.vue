<template>
  <div class="blog-manage-view">
    <div class="manage-header">
      <h1 class="manage-title">博客管理</h1>
      <router-link to="/blog" class="back-button">
        <span class="back-icon">←</span>
        返回博客
      </router-link>
    </div>

    <div class="manage-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'list' }"
        @click="activeTab = 'list'"
      >
        文章列表
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'editor' }"
        @click="activeTab = 'editor'"
      >
        {{ editingPost ? '编辑文章' : '新建文章' }}
      </button>
    </div>

    <!-- 文章列表 -->
    <div v-if="activeTab === 'list'" class="tab-content">
      <div class="list-actions">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索文章..." 
            v-model="searchQuery"
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <button class="new-post-button" @click="createNewPost">
          <span class="new-icon">+</span>
          新建文章
        </button>
      </div>

      <div class="posts-table">
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>分类</th>
              <th>标签</th>
              <th>发布时间</th>
              <th>浏览量</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id">
              <td class="title-cell">
                <div class="post-title">{{ post.title }}</div>
              </td>
              <td>{{ getCategoryName(post.categoryId) }}</td>
              <td>
                <div class="tag-list">
                  <span 
                    v-for="tagId in post.tagIds" 
                    :key="tagId"
                    class="post-tag"
                    :style="{ backgroundColor: getTagColor(tagId) }"
                  >
                    {{ getTagName(tagId) }}
                  </span>
                </div>
              </td>
              <td>{{ formatDate(post.createdAt) }}</td>
              <td>{{ post.views }}</td>
              <td>
                <span class="status-badge" :class="post.status">
                  {{ getStatusText(post.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-button edit" @click="editPost(post.id)">
                    编辑
                  </button>
                  <button class="action-button delete" @click="confirmDelete(post.id)">
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 文章编辑器 -->
    <div v-if="activeTab === 'editor'" class="tab-content">
      <div class="editor-form">
        <div class="form-group">
          <label for="title">文章标题</label>
          <input 
            id="title"
            type="text" 
            v-model="postForm.title"
            placeholder="请输入文章标题"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">分类</label>
            <select id="category" v-model="postForm.categoryId" class="form-select">
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="coverImage">封面图片</label>
            <input 
              id="coverImage"
              type="text" 
              v-model="postForm.coverImage"
              placeholder="请输入图片URL"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>标签</label>
          <div class="tag-selector">
            <div 
              v-for="tag in tags" 
              :key="tag.id"
              class="tag-option"
              :class="{ selected: postForm.tagIds.includes(tag.id) }"
              :style="{ borderColor: tag.color }"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="excerpt">文章摘要</label>
          <textarea 
            id="excerpt"
            v-model="postForm.excerpt"
            placeholder="请输入文章摘要"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="content">文章内容</label>
          <div class="editor-toolbar">
            <button type="button" class="toolbar-button" @click="insertMarkdown('**', '**')">
              <strong>B</strong>
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('*', '*')">
              <em>I</em>
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('## ', '')">
              H2
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('### ', '')">
              H3
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('[', '](url)')">
              链接
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('```\n', '\n```')">
              代码
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('- ', '')">
              列表
            </button>
            <button type="button" class="toolbar-button" @click="insertMarkdown('> ', '')">
              引用
            </button>
          </div>
          <textarea 
            id="content"
            v-model="postForm.content"
            placeholder="请输入文章内容，支持Markdown格式"
            class="form-textarea content-textarea"
            rows="20"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">发布状态</label>
          <select id="status" v-model="postForm.status" class="form-select">
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="preview-button" @click="previewPost">
            <span class="preview-icon">👁</span>
            预览
          </button>
          <button class="save-button" @click="savePost">
            <span class="save-icon">💾</span>
            保存
          </button>
          <button class="publish-button" @click="publishPost" v-if="postForm.status === 'draft'">
            <span class="publish-icon">🚀</span>
            发布
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteDialog" class="dialog-overlay" @click="showDeleteDialog = false">
      <div class="dialog" @click.stop>
        <h3>确认删除</h3>
        <p>确定要删除这篇文章吗？此操作不可恢复。</p>
        <div class="dialog-actions">
          <button class="cancel-button" @click="showDeleteDialog = false">取消</button>
          <button class="confirm-button" @click="deletePost">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const activeTab = ref('list')
const searchQuery = ref('')
const editingPost = ref(null)
const showDeleteDialog = ref(false)
const deletingPostId = ref(null)

// 文章表单数据
const postForm = ref({
  id: null,
  title: '',
  excerpt: '',
  content: '',
  categoryId: '',
  tagIds: [],
  coverImage: '',
  status: 'draft',
  author: 'GrassPillow',
  createdAt: new Date(),
  views: 0,
  likes: 0,
  comments: 0
})

// 模拟数据
const posts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: 'Vue 3 引入的 Composition API 为我们提供了更灵活的组件逻辑组织方式...',
    content: '...',
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
    excerpt: '从零开始搭建一个高效的前端开发环境...',
    content: '...',
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
    excerpt: '记录从零开始搭建个人博客的整个过程...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 2,
    tagIds: [2, 4],
    coverImage: 'https://picsum.photos/seed/blog/800/400.jpg',
    createdAt: new Date('2025-01-01'),
    status: 'published',
    views: 2100,
    likes: 68,
    comments: 12
  },
  {
    id: 4,
    title: 'JavaScript 异步编程演进史',
    excerpt: '从回调函数到 Promise，再到 async/await...',
    content: '...',
    author: 'GrassPillow',
    categoryId: 1,
    tagIds: [1, 5],
    coverImage: 'https://picsum.photos/seed/javascript/800/400.jpg',
    createdAt: new Date('2024-12-28'),
    status: 'draft',
    views: 1560,
    likes: 52,
    comments: 9
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
const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query)
  )
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

const getStatusText = (status) => {
  return status === 'published' ? '已发布' : '草稿'
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('zh-CN', options)
}

const createNewPost = () => {
  editingPost.value = null
  postForm.value = {
    id: null,
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tagIds: [],
    coverImage: '',
    status: 'draft',
    author: 'GrassPillow',
    createdAt: new Date(),
    views: 0,
    likes: 0,
    comments: 0
  }
  activeTab.value = 'editor'
}

const editPost = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    editingPost.value = post
    postForm.value = { ...post }
    activeTab.value = 'editor'
  }
}

const confirmDelete = (postId) => {
  deletingPostId.value = postId
  showDeleteDialog.value = true
}

const deletePost = () => {
  const index = posts.value.findIndex(p => p.id === deletingPostId.value)
  if (index !== -1) {
    posts.value.splice(index, 1)
    showDeleteDialog.value = false
    deletingPostId.value = null
  }
}

const toggleTag = (tagId) => {
  const index = postForm.value.tagIds.indexOf(tagId)
  if (index === -1) {
    postForm.value.tagIds.push(tagId)
  } else {
    postForm.value.tagIds.splice(index, 1)
  }
}

const insertMarkdown = (before, after) => {
  const textarea = document.getElementById('content')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selectedText = text.substring(start, end)
  
  const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
  postForm.value.content = newText
  
  // 重新设置光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + before.length, 
      start + before.length + selectedText.length
    )
  }, 0)
}

const savePost = () => {
  if (!postForm.value.title.trim()) {
    alert('请输入文章标题')
    return
  }
  
  if (postForm.value.id) {
    // 更新现有文章
    const index = posts.value.findIndex(p => p.id === postForm.value.id)
    if (index !== -1) {
      posts.value[index] = { ...postForm.value }
    }
  } else {
    // 创建新文章
    const newPost = {
      ...postForm.value,
      id: Date.now(),
      createdAt: new Date()
    }
    posts.value.unshift(newPost)
  }
  
  activeTab.value = 'list'
  editingPost.value = null
}

const publishPost = () => {
  postForm.value.status = 'published'
  savePost()
}

const previewPost = () => {
  // 在新窗口中预览文章
  const previewData = {
    ...postForm.value,
    tags: postForm.value.tagIds.map(tagId => ({
      id: tagId,
      name: getTagName(tagId),
      color: getTagColor(tagId)
    })),
    category: {
      id: postForm.value.categoryId,
      name: getCategoryName(postForm.value.categoryId)
    }
  }
  
  // 这里可以实现预览功能，例如打开一个新窗口显示文章预览
  console.log('预览文章:', previewData)
  alert('预览功能开发中...')
}

// 生命周期
onMounted(() => {
  // 可以在这里从API获取数据
})
</script>

<style scoped>
.blog-manage-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.manage-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--page-title-color);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  border-radius: 50px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  transition: all 0.3s;
}

.back-button:hover {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.manage-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.tab-button:hover {
  color: var(--primary-color);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.list-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  background: var(--card-bg);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.new-post-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--primary-color);
  color: var(--text-on-accent);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.new-post-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.posts-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

th {
  font-weight: 600;
  color: var(--text-primary);
}

.title-cell {
  max-width: 300px;
}

.post-title {
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.post-tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 50px;
  color: white;
  font-size: 0.75rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.published {
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
  color: var(--primary-color);
}

.status-badge.draft {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: var(--bg-secondary);
}

.action-button.edit:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-button.delete:hover {
  border-color: #f44336;
  color: #f44336;
}

.editor-form {
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--card-bg);
  color: var(--text-primary);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
}

.content-textarea {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 8px 8px 0 0;
  border: 1px solid var(--border-color);
  border-bottom: none;
}

.toolbar-button {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;
}

.toolbar-button:hover {
  background-color: var(--bg-tertiary);
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-option {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 50px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s;
}

.tag-option:hover {
  background-color: var(--bg-secondary);
}

.tag-option.selected {
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.preview-button, .save-button, .publish-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
}

.preview-button {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.preview-button:hover {
  background-color: var(--bg-tertiary);
}

.save-button {
  background: var(--accent-color);
  color: var(--text-on-accent);
}

.save-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.publish-button {
  background: var(--primary-color);
  color: var(--text-on-accent);
}

.publish-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-lg);
}

.dialog h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.dialog p {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-button, .confirm-button {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.cancel-button {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.cancel-button:hover {
  background-color: var(--bg-tertiary);
}

.confirm-button {
  background-color: #f44336;
  color: white;
}

.confirm-button:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .blog-manage-view {
    padding: 1rem;
  }
  
  .manage-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .manage-title {
    font-size: 2rem;
  }
  
  .list-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .posts-table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>