<template>
  <div class="book-detail-view">
    <div class="book-detail-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回图书列表
      </button>
    </div>

    <div v-if="book" class="book-detail-content">
      <div class="book-left-section">
        <div class="detail-cover-wrapper">
          <div class="detail-cover" :style="{ '--cover-color': book.coverColor }">
            <div class="cover-pattern"></div>
            <div class="cover-title">{{ book.title }}</div>
          </div>
          <div class="cover-shadow"></div>
        </div>

        <div class="book-actions">
          <button class="action-btn primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6l4 2"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            开始阅读
          </button>
          <button class="action-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            加入书架
          </button>
          <button class="action-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            分享
          </button>
        </div>
      </div>

      <div class="book-right-section">
        <div class="book-category-tag">{{ book.category }}</div>
        <h1 class="book-title-text">{{ book.title }}</h1>
        <p class="book-author-text">
          <span class="author-label">作者</span>
          <span class="author-name">{{ book.author }}</span>
        </p>

        <div class="book-meta-info">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>图书</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>持续更新</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>热门推荐</span>
          </div>
        </div>

        <div class="book-description">
          <h3>内容简介</h3>
          <p>{{ book.description }}</p>
        </div>

        <div v-if="relatedBooks.length > 0" class="related-books">
          <h3>同类推荐</h3>
          <div class="related-list">
            <div
              v-for="related in relatedBooks"
              :key="related.title"
              class="related-item"
              @click="goToDetail(related.title)"
            >
              <div class="related-cover" :style="{ '--cover-color': related.coverColor }">
                <span>{{ related.title }}</span>
              </div>
              <div class="related-info">
                <h4>{{ related.title }}</h4>
                <p>{{ related.author }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <p>正在加载...</p>
    </div>

    <div v-else-if="bookNotFound" class="loading-state">
      <div class="not-found-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p>图书未找到</p>
      <button class="back-btn" @click="goBack">返回图书列表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const book = ref(null)
const allBooks = ref([])
const bookNotFound = ref(false)
const isLoading = ref(true)

const relatedBooks = computed(() => {
  if (!book.value || !allBooks.value.length) return []
  return allBooks.value
    .filter(b => b.category === book.value.category && b.title !== book.value.title)
    .slice(0, 4)
})

function goBack() {
  router.push('/books')
}

function goToDetail(title) {
  router.push({
    path: '/book/detail',
    query: { title: encodeURIComponent(title) }
  })
}

async function loadBook(bookTitle) {
  bookNotFound.value = false
  isLoading.value = true
  book.value = null

  try {
    if (!allBooks.value.length) {
      const response = await axios.get('/books.csv')
      allBooks.value = parseCSV(response.data)
    }
    book.value = allBooks.value.find(b => b.title === decodeURIComponent(bookTitle))

    if (!book.value) {
      bookNotFound.value = true
    }
  } catch (error) {
    console.error('Failed to load book:', error)
    bookNotFound.value = true
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query.title,
  (newTitle) => {
    if (newTitle) {
      loadBook(newTitle)
    }
  }
)

onMounted(() => {
  const bookTitle = route.query.title
  if (bookTitle) {
    loadBook(bookTitle)
  } else {
    isLoading.value = false
  }
})

function parseCSV(csvText) {
  if (!csvText || !csvText.trim()) {
    return []
  }

  const lines = csvText.trim().split('\n').filter(line => line.trim())
  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = []
    let currentValue = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

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
        book[header] = values[index] || ''
      })
      if (book.title && book.author) {
        data.push(book)
      }
    }
  }

  return data
}
</script>

<style scoped>
.book-detail-view {
  min-height: calc(100vh - 60px);
  background: var(--c-bg-page);
  padding: 0;
}

.book-detail-header {
  padding: 30px 40px 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid rgba(45, 122, 107, 0.2);
  border-radius: 12px;
  color: #2d5a4f;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.back-btn:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
  transform: translateX(-4px);
}

.book-detail-content {
  display: flex;
  gap: 80px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

.book-left-section {
  flex-shrink: 0;
  width: 320px;
}

.detail-cover-wrapper {
  position: relative;
}

.detail-cover {
  width: 320px;
  height: 450px;
  background: var(--cover-color);
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.detail-cover:hover {
  transform: translateY(-10px);
}

.cover-pattern {
  display: none;
}

.cover-title {
  position: relative;
  z-index: var(--z-base);
  color: white;
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  padding: 0 30px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cover-shadow {
  position: absolute;
  bottom: -40px;
  left: 20px;
  right: 20px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  filter: blur(20px);
}

.book-actions {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.primary {
  background: var(--c-primary);
  border: none;
  color: white;
  box-shadow: 0 8px 24px rgba(45, 122, 107, 0.35);
}

.action-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.45);
}

.action-btn.secondary {
  background: white;
  border: 2px solid rgba(45, 122, 107, 0.2);
  color: #2d5a4f;
}

.action-btn.secondary:hover {
  border-color: #2d7a6b;
  background: rgba(45, 122, 107, 0.05);
}

.book-right-section {
  flex: 1;
  padding-top: 10px;
}

.book-category-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  background: rgba(45, 122, 107, 0.1);
  color: #2d7a6b;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.book-title-text {
  font-size: 3.2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.2;
}

.book-author-text {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 30px 0;
  font-size: 1.2rem;
}

.author-label {
  color: #999;
  font-size: 0.95rem;
}

.author-name {
  color: #2d7a6b;
  font-weight: 600;
}

.book-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5a4a3a;
  font-size: 0.95rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.meta-item svg {
  width: 18px;
  height: 18px;
  color: #2d7a6b;
}

.book-description {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.book-description h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.book-description p {
  font-size: 1.15rem;
  line-height: 1.9;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.related-books h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.related-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid rgba(45, 122, 107, 0.1);
}

.related-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(45, 122, 107, 0.15);
  border-color: rgba(45, 122, 107, 0.3);
}

.related-cover {
  width: 70px;
  height: 90px;
  background: var(--cover-color);
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.related-cover span {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  padding: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.related-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1e5a4a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-info p {
  font-size: 0.85rem;
  color: #5a4a3a;
  margin: 0;
  opacity: 0.7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.loading-state {
  text-align: center;
  padding: 120px 40px;
}

.loading-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-icon svg {
  width: 100%;
  height: 100%;
  color: #2d7a6b;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1); }
}

.not-found-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.not-found-icon svg {
  width: 100%;
  height: 100%;
  color: #999;
}

.loading-state p {
  font-size: 1.2rem;
  color: #5a4a3a;
  margin-bottom: 30px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@media (max-width: 1000px) {
  .book-detail-content {
    flex-direction: column;
    align-items: center;
    padding: 40px 24px;
    gap: 50px;
  }

  .book-left-section {
    width: 100%;
    max-width: 320px;
  }

  .detail-cover {
    width: 280px;
    height: 400px;
  }

  .cover-title {
    font-size: 1.8rem;
  }

  .book-right-section {
    width: 100%;
    padding-top: 0;
  }

  .book-title-text {
    font-size: 2.2rem;
    text-align: center;
  }

  .book-author-text {
    justify-content: center;
  }

  .book-meta-info {
    justify-content: center;
  }

  .related-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .book-detail-header {
    padding: 20px 16px 0;
  }

  .book-detail-content {
    padding: 30px 16px;
  }

  .detail-cover {
    width: 100%;
    max-width: 280px;
    height: 380px;
  }

  .book-title-text {
    font-size: 1.8rem;
  }

  .book-description {
    padding: 24px;
  }

  .book-description p {
    font-size: 1rem;
  }
}
</style>
