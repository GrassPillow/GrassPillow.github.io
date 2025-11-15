import { createWebHistory, createRouter } from 'vue-router'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', redirect: '/earthquake' },
  { path: '/earthquake', component: () => import('../components/EarthquakeList.vue') },
  { path: '/about', component: AboutView },
  { path: '/map', component: () => import('../views/MapView.vue') },
  { path: '/clock', component: () => import('../views/ClockView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router