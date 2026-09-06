import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme.js'

// Initialize theme
const { initTheme } = useTheme()
initTheme()

// 全局错误处理：抑制 ResizeObserver 循环错误（浏览器已知 bug，不影响功能）
const isResizeObserverError = (message?: string): boolean => {
  return !!message && (
    message.includes('ResizeObserver loop') ||
    message.includes('ResizeObserver loop completed with undelivered notifications')
  )
}

window.addEventListener('error', (e) => {
  if (isResizeObserverError(e.message)) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}, { capture: true })

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')