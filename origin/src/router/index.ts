import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { 
    path: '/', 
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页 - 多功能服务平台' }
  },
  { 
    path: '/books', 
    component: () => import('../views/BookListView.vue'),
    meta: { title: '图书管理 - 多功能服务平台' }
  },
  { 
    path: '/ai', 
    component: () => import('../views/AIView.vue'),
    meta: { title: 'AI工具 - 多功能服务平台' }
  },
  { 
    path: '/earthquake', 
    component: () => import('../components/EarthquakeList.vue'),
    meta: { title: '地震监测 - 多功能服务平台' }
  },
  { 
    path: '/about', 
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于我们 - 多功能服务平台' }
  },
  { 
    path: '/clock', 
    component: () => import('../views/ClockView.vue'),
    meta: { title: '时钟工具 - 多功能服务平台' }
  },
  { 
    path: '/product-3d', 
    component: () => import('../views/Product3DView.vue'),
    meta: { title: '3D产品展示 - 多功能服务平台' }
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