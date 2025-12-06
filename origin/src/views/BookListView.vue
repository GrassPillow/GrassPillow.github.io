<template>
  <div class="book-list-view" @scroll="handleScroll" ref="scrollContainer">
    <div class="book-header">
      <h1 class="book-title">图书列表</h1>
      <p class="book-subtitle">探索知识的海洋，发现阅读的乐趣</p>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索书名、作者、分类..."
          @input="handleSearch"
        />
        <div v-if="searchQuery" class="search-results-info">
          找到 {{ filteredBooks.length }} 本相关图书
        </div>
      </div>
    </div>
    <div v-if="searchQuery && filteredBooks.length === 0 && !isLoading && books.length > 0" class="no-results">
      <p class="no-results-text">未找到相关图书</p>
      <p class="no-results-hint">试试搜索其他关键词</p>
    </div>
    <div v-else-if="displayedBooks.length > 0 || !searchQuery" class="book-container">
      <BookCard
        v-for="(book, index) in displayedBooks"
        :key="`${book.title || 'book'}-${index}`"
        :title="book.title"
        :author="book.author"
        :description="book.description"
        :cover-color="book.coverColor"
        :category="book.category"
      />
    </div>
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>
    <div v-if="hasMore === false && displayedBooks.length > 0 && !searchQuery" class="no-more">
      <p>已加载全部图书</p>
    </div>
    <div v-if="hasMore === false && displayedBooks.length > 0 && searchQuery" class="no-more">
      <p>已显示全部搜索结果</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import BookCard from '../components/BookCard.vue'

const books = ref([])
const displayedBooks = ref([])
const currentPage = ref(1)
const pageSize = ref(6) // 每页显示6本书
const isLoading = ref(false)
const hasMore = ref(true)
const scrollContainer = ref(null)
const searchQuery = ref('')
let scrollTimeout = null

// 过滤后的图书列表
const filteredBooks = computed(() => {
  if (!Array.isArray(books.value) || books.value.length === 0) {
    return []
  }
  
  if (!searchQuery.value || !searchQuery.value.trim()) {
    return books.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return books.value.filter(book => {
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
})

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
      const book = {}
      headers.forEach((header, index) => {
        book[header] = values[index]
      })
      data.push(book)
    }
  }
  
  return data
}

// 加载更多书籍
function loadMoreBooks() {
  if (isLoading.value || !hasMore.value) return
  
  const sourceBooks = filteredBooks.value
  if (!Array.isArray(sourceBooks) || sourceBooks.length === 0) {
    hasMore.value = false
    return
  }
  
  isLoading.value = true
  
  // 模拟加载延迟，实际使用时可以移除
  setTimeout(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    const newBooks = sourceBooks.slice(startIndex, endIndex)
    
    if (newBooks.length > 0) {
      displayedBooks.value.push(...newBooks)
      currentPage.value++
      
      // 检查是否还有更多数据
      if (endIndex >= sourceBooks.length) {
        hasMore.value = false
      }
    } else {
      hasMore.value = false
    }
    
    isLoading.value = false
  }, 500) // 500ms延迟，模拟网络请求
}

// 处理搜索
function handleSearch() {
  // 重置分页状态
  displayedBooks.value = []
  currentPage.value = 1
  
  const filtered = filteredBooks.value
  hasMore.value = filtered.length > 0
  
  // 如果有搜索结果，加载第一页
  if (filtered.length > 0) {
    loadMoreBooks()
  }
}

// 监听搜索查询变化
watch(searchQuery, () => {
  // 确保数据已加载
  if (Array.isArray(books.value)) {
    handleSearch()
  }
}, { immediate: false })

// 处理滚动事件
function handleScroll(event) {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  scrollTimeout = setTimeout(() => {
    const container = event.target
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    
    // 当滚动到距离底部200px时加载更多
    if (scrollHeight - scrollTop - clientHeight < 200) {
      loadMoreBooks()
    }
  }, 100) // 防抖处理
}

onMounted(async () => {
  try {
    const response = await axios.get('/books.csv')
    const csvData = parseCSV(response.data)
    books.value = csvData
    
    // 初始加载第一页
    if (books.value.length > 0) {
      loadMoreBooks()
    }
  } catch (error) {
    console.error('Failed to load books from CSV:', error)
    // 如果加载失败，使用默认数据
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
        description: '记录时光的痕迹，感受岁月的沉淀。每一页都是生活的缩影，每一个故事都值得珍藏。',
        coverColor: '#8b6f47',
        category: '文学'
      },
      {
        title: '智慧之光',
        author: '作者名',
        description: '知识的灯塔，照亮前行的路。汇聚古今中外的智慧结晶，启迪心灵，开阔视野。',
        coverColor: '#1e5a4a',
        category: '哲学'
      },
      {
        title: '艺术人生',
        author: '作者名',
        description: '艺术源于生活，高于生活。感受艺术的魅力，体验创作的快乐，发现美的真谛。',
        coverColor: '#5a4a3a',
        category: '艺术'
      },
      {
        title: '科学探索',
        author: '作者名',
        description: '科学的奥秘等待我们去发现。从微观到宏观，从过去到未来，探索未知的世界。',
        coverColor: '#2d7a6b',
        category: '科学'
      },
      {
        title: '历史长河',
        author: '作者名',
        description: '回顾历史，展望未来。了解过去的故事，理解现在的发展，预见未来的趋势。',
        coverColor: '#8b6f47',
        category: '历史'
      },
      {
        title: '心灵之旅',
        author: '作者名',
        description: '内心的探索，精神的成长。在阅读中寻找答案，在思考中获得智慧，在感悟中提升自我。',
        coverColor: '#1e5a4a',
        category: '心理'
      },
      {
        title: '创意无限',
        author: '作者名',
        description: '激发创意，释放潜能。从不同的角度思考问题，用创新的方式解决问题，创造无限可能。',
        coverColor: '#5a4a3a',
        category: '设计'
      }
    ]
    
    if (books.value.length > 0) {
      loadMoreBooks()
    }
  }
})

onUnmounted(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
.book-list-view {
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, 
    #f5f5f7 0%, 
    rgba(45, 122, 107, 0.05) 50%,
    rgba(139, 111, 71, 0.05) 100%);
  scroll-behavior: smooth;
}

.book-header {
  text-align: center;
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, 
    rgba(45, 122, 107, 0.1) 0%, 
    rgba(45, 122, 107, 0.05) 50%,
    rgba(139, 111, 71, 0.05) 50%,
    rgba(139, 111, 71, 0.1) 100%);
}

.book-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  transition: all 0.3s ease;
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

.book-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
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
  
  .book-header {
    padding: 60px 20px 40px;
  }
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(45, 122, 107, 0.2);
  border-top-color: #2d7a6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #2d7a6b;
  font-size: 1rem;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.no-more {
  text-align: center;
  padding: 40px 20px;
  color: #5a4a3a;
  font-size: 0.95rem;
  opacity: 0.7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>

