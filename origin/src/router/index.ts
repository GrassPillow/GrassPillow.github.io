import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { 
    path: '/', 
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页 - GrassPillow博客' }
  },
  { 
    path: '/blog', 
    component: () => import('../views/BlogView.vue'),
    meta: { title: '博客 - GrassPillow' }
  },
  { 
    path: '/blog/post/:id', 
    component: () => import('../views/BlogPostView.vue'),
    meta: { title: '文章详情 - GrassPillow博客' }
  },
  { 
    path: '/blog/manage', 
    component: () => import('../views/BlogManageView.vue'),
    meta: { title: '博客管理 - GrassPillow' }
  },
  {
    path: '/books',
    component: () => import('../views/BookListView.vue'),
    meta: { title: '图书管理 - GrassPillow' }
  },
  {
    path: '/book/detail',
    component: () => import('../views/BookDetailView.vue'),
    meta: { title: '图书详情 - GrassPillow' }
  },
  { 
    path: '/ai', 
    component: () => import('../views/AIView.vue'),
    meta: { title: 'AI工具 - GrassPillow' }
  },
  { 
    path: '/earthquake', 
    component: () => import('../components/EarthquakeList.vue'),
    meta: { title: '地震监测 - GrassPillow' }
  },
  { 
    path: '/about', 
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于我 - GrassPillow' }
  },
  { 
    path: '/clock', 
    component: () => import('../views/ClockView.vue'),
    meta: { title: '时钟工具 - GrassPillow' }
  },
  { 
    path: '/product-3d', 
    component: () => import('../views/Product3DView.vue'),
    meta: { title: '3D产品展示 - GrassPillow' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
  next()
})

export default router