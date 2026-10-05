<template>
  <div class="gallery-view">
    <!-- Header -->
    <header class="gallery-header">
      <div class="header-content">
        <h1 class="page-title">相册作品</h1>
        <p class="page-subtitle">记录生活中的美好瞬间</p>
      </div>
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          class="filter-tab"
          :class="{ active: activeCategory === category.id }"
          @click="filterGallery(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </header>

    <!-- Gallery Grid -->
    <section class="gallery-container">
      <transition-group name="gallery-item" tag="div" class="gallery-grid">
        <div
          v-for="item in filteredGallery"
          :key="item.id"
          class="gallery-item"
          :class="item.size"
          @click="openLightbox(item)"
        >
          <div class="item-image">
            <img v-lazy-img="item.thumbnail" :alt="item.title" />
            <div class="item-overlay">
              <div class="item-info">
                <h3 class="item-title">{{ item.title }}</h3>
                <p class="item-date">{{ item.date }}</p>
              </div>
              <span class="view-icon">🔍</span>
            </div>
          </div>
        </div>
      </transition-group>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <button class="lightbox-nav prev" @click="prevImage">‹</button>
          <button class="lightbox-nav next" @click="nextImage">›</button>
          <div class="lightbox-content">
            <img :src="currentItem?.src" :alt="currentItem?.title" />
            <div class="lightbox-info">
              <h3>{{ currentItem?.title }}</h3>
              <p>{{ currentItem?.description }}</p>
              <span class="lightbox-date">{{ currentItem?.date }}</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { lazyImgDirective } from '../composables/useLazyLoad.js'

const vLazyImg = lazyImgDirective

const categories = [
  { id: 'all', name: '全部' },
  { id: 'photography', name: '摄影' },
  { id: 'design', name: '设计' },
  { id: 'screenshot', name: '截图' },
  { id: 'life', name: '生活' }
]

const activeCategory = ref('all')
const lightboxOpen = ref(false)
const currentIndex = ref(0)

const galleryItems = ref([
  {
    id: 1,
    title: '晨光微熹',
    description: '清晨的第一缕阳光洒落在城市的天际线上',
    thumbnail: 'https://picsum.photos/seed/gallery1/400/300.jpg',
    src: 'https://picsum.photos/seed/gallery1/1200/800.jpg',
    category: 'photography',
    date: '2024-01-15',
    size: 'large'
  },
  {
    id: 2,
    title: '代码之美',
    description: '深夜编程时的灵感瞬间',
    thumbnail: 'https://picsum.photos/seed/gallery2/400/400.jpg',
    src: 'https://picsum.photos/seed/gallery2/1200/1200.jpg',
    category: 'screenshot',
    date: '2024-01-10',
    size: 'normal'
  },
  {
    id: 3,
    title: '自然风光',
    description: '周末郊游时拍摄的山间美景',
    thumbnail: 'https://picsum.photos/seed/gallery3/400/300.jpg',
    src: 'https://picsum.photos/seed/gallery3/1200/800.jpg',
    category: 'photography',
    date: '2024-01-08',
    size: 'wide'
  },
  {
    id: 4,
    title: 'UI设计稿',
    description: '为某App设计的界面方案',
    thumbnail: 'https://picsum.photos/seed/gallery4/400/500.jpg',
    src: 'https://picsum.photos/seed/gallery4/1200/1500.jpg',
    category: 'design',
    date: '2024-01-05',
    size: 'normal'
  },
  {
    id: 5,
    title: '城市夜景',
    description: '夜幕降临时分城市的灯火阑珊',
    thumbnail: 'https://picsum.photos/seed/gallery5/400/300.jpg',
    src: 'https://picsum.photos/seed/gallery5/1200/800.jpg',
    category: 'photography',
    date: '2024-01-03',
    size: 'normal'
  },
  {
    id: 6,
    title: '咖啡时光',
    description: '周末的下午茶时光',
    thumbnail: 'https://picsum.photos/seed/gallery6/400/400.jpg',
    src: 'https://picsum.photos/seed/gallery6/1200/1200.jpg',
    category: 'life',
    date: '2024-01-01',
    size: 'normal'
  },
  {
    id: 7,
    title: '产品原型',
    description: '新项目的产品原型设计',
    thumbnail: 'https://picsum.photos/seed/gallery7/600/400.jpg',
    src: 'https://picsum.photos/seed/gallery7/1800/1200.jpg',
    category: 'design',
    date: '2023-12-28',
    size: 'wide'
  },
  {
    id: 8,
    title: '旅途风景',
    description: '旅行途中遇到的美丽风景',
    thumbnail: 'https://picsum.photos/seed/gallery8/400/500.jpg',
    src: 'https://picsum.photos/seed/gallery8/1200/1500.jpg',
    category: 'photography',
    date: '2023-12-25',
    size: 'normal'
  }
])

const filteredGallery = computed(() => {
  if (activeCategory.value === 'all') {
    return galleryItems.value
  }
  return galleryItems.value.filter(item => item.category === activeCategory.value)
})

const currentItem = computed(() => {
  const list = filteredGallery.value
  return list[currentIndex.value] || null
})

const filterGallery = (category) => {
  activeCategory.value = category
}

const openLightbox = (item) => {
  // 在过滤后的列表中定位，保证筛选态翻页不越界
  currentIndex.value = filteredGallery.value.findIndex(i => i.id === item.id)
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  const list = filteredGallery.value
  currentIndex.value = currentIndex.value > 0
    ? currentIndex.value - 1
    : list.length - 1
}

const nextImage = () => {
  const list = filteredGallery.value
  currentIndex.value = currentIndex.value < list.length - 1
    ? currentIndex.value + 1
    : 0
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // 还原 body 滚动，防止 lightbox 打开时离开页面导致滚动永久锁死
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-view {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.gallery-header {
  background: var(--gradient-hero);
  padding: 60px 24px 40px;
  text-align: center;
}

.header-content {
  margin-bottom: 32px;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 10px 24px;
  border: none;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.filter-tab.active {
  background: #fff;
  color: var(--primary-dark);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Gallery Grid */
.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gallery-item.large {
  grid-column: span 2;
  grid-row: span 2;
}

.gallery-item.wide {
  grid-column: span 2;
}

.gallery-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.item-image {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  overflow: hidden;
}

.gallery-item.large .item-image {
  padding-bottom: calc(150% + 20px);
}

.gallery-item.wide .item-image {
  padding-bottom: 37.5%;
}

.item-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.gallery-item:hover .item-image img {
  transform: scale(1.1);
}

.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .item-overlay {
  opacity: 1;
}

.item-info {
  color: #fff;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.item-date {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
}

.view-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.gallery-item:hover .view-icon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
  left: 20px;
}

.lightbox-nav.next {
  right: 20px;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-info {
  text-align: center;
  color: #fff;
  margin-top: 20px;
}

.lightbox-info h3 {
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.lightbox-info p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0 0 8px;
}

.lightbox-date {
  font-size: 0.9rem;
  opacity: 0.6;
}

/* Transitions */
.gallery-item-enter-active,
.gallery-item-leave-active {
  transition: all 0.4s ease;
}

.gallery-item-enter-from,
.gallery-item-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .gallery-item.large {
    grid-column: span 2;
    grid-row: span 1;
  }

  .gallery-item.large .item-image {
    padding-bottom: 50%;
  }

  .lightbox-nav {
    width: 44px;
    height: 44px;
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .filter-tabs {
    gap: 8px;
  }

  .filter-tab {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-item.large,
  .gallery-item.wide {
    grid-column: span 1;
  }

  .gallery-item.wide .item-image {
    padding-bottom: 75%;
  }
}
</style>
