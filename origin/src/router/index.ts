import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '资源站 - 发现好用的网络资源' }
  },
  {
    path: '/resources/all',
    component: () => import('../views/ResourceView.vue'),
    props: { type: 'all' },
    meta: { title: '全部资源 - 资源站' }
  },
  {
    path: '/resources/website',
    component: () => import('../views/ResourceView.vue'),
    props: { type: 'website' },
    meta: { title: '网站工具 - 资源站' }
  },
  {
    path: '/resources/software',
    component: () => import('../views/ResourceView.vue'),
    props: { type: 'software' },
    meta: { title: '软件应用 - 资源站' }
  },
  {
    path: '/resources/learning',
    component: () => import('../views/ResourceView.vue'),
    props: { type: 'learning' },
    meta: { title: '学习资料 - 资源站' }
  },
  {
    path: '/resources/media',
    component: () => import('../views/ResourceView.vue'),
    props: { type: 'media' },
    meta: { title: '影视音乐电子书 - 资源站' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
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
