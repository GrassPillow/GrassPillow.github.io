<template>
  <div class="book-list-view">
    <div class="book-header">
      <h1 class="book-title">图书列表</h1>
      <p class="book-subtitle">探索知识的海洋，发现阅读的乐趣</p>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索书名、作者、分类..."
        />
        <div v-if="searchQuery" class="search-results-info">
          找到 {{ filteredBooks.length }} 本相关图书
        </div>
      </div>
      <div class="view-toggle">
        <button
          :class="['view-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
          title="网格视图"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          :class="['view-btn', { active: viewMode === 'list' }]"
          @click="viewMode = 'list'"
          title="列表视图"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>
      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category"
          :class="['category-btn', { active: selectedCategory === category }]"
          @click="selectedCategory = selectedCategory === category ? '全部' : category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div v-if="books.length === 0 && !isLoading" class="no-results">
      <p class="no-results-text">暂无图书数据</p>
      <p class="no-results-hint">请稍后重试</p>
      <button class="no-results-btn" @click="fetchBooks">刷新</button>
    </div>
    <div v-else-if="searchQuery && filteredBooks.length === 0 && books.length > 0" class="no-results">
      <p class="no-results-text">未找到相关图书</p>
      <p class="no-results-hint">试试搜索其他关键词</p>
      <button class="no-results-btn" @click="searchQuery = ''">清除搜索</button>
    </div>
    <div v-else-if="filteredBooks.length > 0" :class="['book-container', viewMode]">
      <template v-if="viewMode === 'grid'">
        <BookCard
          v-for="(book, index) in filteredBooks"
          :key="`${book.title || 'book'}-${index}`"
          :title="book.title"
          :author="book.author"
          :description="book.description"
          :cover-color="book.coverColor"
          :category="book.category"
        />
      </template>
      <template v-else>
        <div
          v-for="(book, index) in filteredBooks"
          :key="`${book.title || 'book'}-${index}`"
          class="book-list-item"
          :style="{ '--cover-color': book.coverColor }"
          @click="goToDetail(book.title)"
        >
          <div class="list-book-cover">
            <div class="list-cover-pattern"></div>
            <div class="list-cover-title">{{ book.title }}</div>
          </div>
          <div class="list-book-info">
            <div class="list-book-header">
              <h3 class="list-book-name">{{ book.title }}</h3>
              <span class="list-book-category">{{ book.category }}</span>
            </div>
            <p class="list-book-author">作者：{{ book.author }}</p>
            <p class="list-book-desc">{{ book.description }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import BookCard from '../components/BookCard.vue'
import { useToast } from '../composables/useToast.js'
import { parseCSV } from '../utils/csv.js'

const router = useRouter()
const toast = useToast()

const books = ref([])
const isLoading = ref(false)
// 卸载标志：异步请求返回后不再写入组件状态或弹 Toast
let cancelled = false
const searchQuery = ref('')
const selectedCategory = ref('全部')
const viewMode = ref('grid')

const categories = computed(() => {
  const cats = new Set(books.value.map(b => b.category).filter(Boolean))
  return ['全部', ...Array.from(cats).sort()]
})

function goToDetail(title) {
  router.push({
    path: '/book/detail',
    query: { title: encodeURIComponent(title) }
  })
}

const filteredBooks = computed(() => {
  if (!Array.isArray(books.value) || books.value.length === 0) {
    return []
  }

  let result = books.value

  if (selectedCategory.value !== '全部') {
    result = result.filter(book => book.category === selectedCategory.value)
  }

  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(book => {
      if (!book) return false
      const title = (book.title || '').toLowerCase()
      const author = (book.author || '').toLowerCase()
      const description = (book.description || '').toLowerCase()
      const category = (book.category || '').toLowerCase()
      return title.includes(query) ||
             author.includes(query) ||
             description.includes(query) ||
             category.includes(query)
    })
  }

  return result
})

async function fetchBooks() {
  cancelled = false
  try {
    isLoading.value = true
    const response = await axios.get('/books.csv')
    if (cancelled) return // 组件已卸载，放弃后续写入
    const csvData = parseCSV(response.data)
    books.value = csvData

    if (books.value.length > 0 && !cancelled) {
      toast.success(`成功加载 ${books.value.length} 本图书`)
    } else if (!cancelled) {
      toast.warning('未找到图书数据')
    }
  } catch (error) {
    if (cancelled) return
    console.error('Failed to load books from CSV:', error)
    toast.error('加载图书数据失败，已使用默认数据')
    books.value = [
      {
        title: '三体',
        author: '刘慈欣',
        description: '刘慈欣所著的科幻小说，讲述了地球文明与三体文明之间的交流与对抗。',
        coverColor: '#2d7a6b',
        category: '科幻'
      },
      {
        title: '西游八十一案：大唐梵天记',
        author: '陈渐',
        description: '记录时光的痕迹，感受岁月的沉淀。',
        coverColor: '#8b6f47',
        category: '文学'
      },
      {
        title: '智慧之光',
        author: '作者名',
        description: '知识的灯塔，照亮前行的路。',
        coverColor: '#1e5a4a',
        category: '哲学'
      },
      {
        title: '艺术人生',
        author: '作者名',
        description: '艺术源于生活，高于生活。',
        coverColor: '#5a4a3a',
        category: '艺术'
      },
      {
        title: '科学探索',
        author: '作者名',
        description: '科学的奥秘等待我们去发现。',
        coverColor: '#2d7a6b',
        category: '科学'
      },
      {
        title: '历史长河',
        author: '作者名',
        description: '回顾历史，展望未来。',
        coverColor: '#8b6f47',
        category: '历史'
      },
      {
        title: '心灵之旅',
        author: '作者名',
        description: '内心的探索，精神的成长。',
        coverColor: '#1e5a4a',
        category: '心理'
      },
      {
        title: '创意无限',
        author: '作者名',
        description: '激发创意，释放潜能。',
        coverColor: '#5a4a3a',
        category: '设计'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBooks)

onUnmounted(() => {
  cancelled = true
})
</script>

<style scoped>
.book-list-view {
  width: 100%;
  min-height: calc(100vh - 60px);
  margin: 0;
  padding: 0;
  background: var(--c-bg-page);
}

.book-header {
  text-align: center;
  padding: 80px 20px 60px;
  background: var(--c-bg-warm);
}

.book-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e5a4a;
}

.book-subtitle {
  font-size: 1.2rem;
  color: #2d5a4f;
  margin: 0 0 2rem 0;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid rgba(45, 122, 107, 0.2);
  border-radius: 12px;
  background: white;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #2d7a6b;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.15);
}

.search-input::placeholder {
  color: #999;
  opacity: 0.7;
}

.search-results-info {
  margin-top: 1rem;
  text-align: center;
  color: #2d7a6b;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 2rem;
  padding: 0 20px;
}

.category-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border: 2px solid rgba(45, 122, 107, 0.2);
  border-radius: 25px;
  background: white;
  color: #2d5a4f;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.category-btn:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
  transform: translateY(-2px);
}

.category-btn.active {
  background: #2d7a6b;
  border-color: #2d7a6b;
  color: white;
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.no-results-text {
  font-size: 1.25rem;
  color: #5a4a3a;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 600;
}

.no-results-hint {
  font-size: 0.95rem;
  color: #999;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.no-results-btn {
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  background: #2d7a6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.no-results-btn:hover {
  background: #1e5a4a;
  transform: translateY(-2px);
}

.book-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.book-container.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 列表视图样式 */
.book-list-item {
  display: flex;
  background: var(--c-bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08),
              0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.book-list-item:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.15),
              0 2px 8px rgba(139, 111, 71, 0.1);
  cursor: pointer;
}

.book-list-item:active {
  transform: translateX(4px);
}

.list-book-cover {
  width: 120px;
  min-width: 120px;
  height: 160px;
  background: var(--cover-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.list-cover-pattern {
  display: none;
}

.list-cover-title {
  position: relative;
  z-index: var(--z-base);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  padding: 0 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-book-info {
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.list-book-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.list-book-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.list-book-category {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(45, 122, 107, 0.1);
  color: #2d7a6b;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.list-book-author {
  font-size: 0.9rem;
  color: #5a4a3a;
  margin: 0 0 10px 0;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.list-book-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2d5a4f;
  margin: 0;
  opacity: 0.85;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 视图切换按钮样式 */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(45, 122, 107, 0.2);
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  width: 20px;
  height: 20px;
  color: #2d5a4f;
}

.view-btn:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
}

.view-btn.active {
  background: #2d7a6b;
  border-color: #2d7a6b;
}

.view-btn.active svg {
  color: white;
}

@media (max-width: 768px) {
  .book-title {
    font-size: 2.5rem;
  }

  .book-subtitle {
    font-size: 1rem;
  }

  .book-container {
    grid-template-columns: 1fr;
    padding: 30px 15px 60px;
    gap: 20px;
  }

  .book-container.list {
    padding: 30px 15px 60px;
  }

  .book-header {
    padding: 60px 20px 40px;
  }

  .book-list-item {
    flex-direction: row;
  }

  .list-book-cover {
    width: 100px;
    min-width: 100px;
    height: 140px;
  }

  .list-book-info {
    padding: 16px 20px;
  }

  .list-book-name {
    font-size: 1.1rem;
  }

  .list-book-desc {
    -webkit-line-clamp: 2;
  }
}
</style>
