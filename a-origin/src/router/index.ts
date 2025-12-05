import { createWebHistory, createRouter } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/books', component: () => import('../views/BookListView.vue') },
  { path: '/ai', component: () => import('../views/AIView.vue') },
  { path: '/earthquake', component: () => import('../components/EarthquakeList.vue') },
  { path: '/about', component: AboutView },
  { path: '/clock', component: () => import('../views/ClockView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router