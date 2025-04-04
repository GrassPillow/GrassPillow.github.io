import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/home', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/map', component: () => import('../views/MapView.vue') },
  { path: '/clock', component: () => import('../views/ClockView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router