import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'GrassPillow - 个人主页' }
  },
  {
    path: '/about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于我 - GrassPillow' }
  },
  {
    path: '/projects',
    component: () => import('../views/ProjectsView.vue'),
    meta: { title: '作品集 - GrassPillow' }
  },
  {
    path: '/blog',
    component: () => import('../views/BlogView.vue'),
    meta: { title: '博客 - GrassPillow' }
  },
  {
    path: '/blog/post/:id',
    component: () => import('../views/BlogPostView.vue'),
    meta: { title: '文章详情 - GrassPillow' }
  },
  {
    path: '/tools',
    redirect: '/tools/ai'
  },
  {
    path: '/tools/ai',
    component: () => import('../views/AIView.vue'),
    meta: { title: 'AI工具 - GrassPillow' }
  },
  {
    path: '/tools/clock',
    component: () => import('../views/ClockView.vue'),
    meta: { title: '时钟工具 - GrassPillow' }
  },
  {
    path: '/tools/earthquake',
    component: () => import('../components/EarthquakeList.vue'),
    meta: { title: '地震监测 - GrassPillow' }
  },
  {
    path: '/books',
    component: () => import('../views/BookListView.vue'),
    meta: { title: '阅读清单 - GrassPillow' }
  },
  {
  {
    path: '/gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: { title: '相册作品 - GrassPillow' }
  },
  {
    path: '/timeline',
    component: () => import('../views/TimelineView.vue'),
    meta: { title: '成长轨迹 - GrassPillow' }
  },
  {
    path: '/todo',
    component: () => import('../views/TodoView.vue'),
    meta: { title: '待办清单 - GrassPillow' }
  },
  {
    path: '/music',
    component: () => import('../views/MusicView.vue'),
    meta: { title: '音乐空间 - GrassPillow' }
  },
  {
    path: '/book/detail',
    component: () => import('../views/BookDetailView.vue'),
    meta: { title: '图书详情 - GrassPillow' }
  },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for page titles
router.beforeEach((to, from, next) => {
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
  next()
})

export default router
