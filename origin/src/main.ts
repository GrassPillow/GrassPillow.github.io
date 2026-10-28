import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme.js'

// Initialize theme
const { initTheme } = useTheme()
initTheme()

/**
 * ResizeObserver 循环错误抑制
 *
 * 浏览器在 ResizeObserver 回调里同步修改被观察元素的尺寸时会抛出
 * "ResizeObserver loop completed with undelivered notifications"。
 * 这是浏览器的已知行为而非本站缺陷，Vue 过渡动画会稳定触发，
 * 因此只放行这一类错误，其余错误照常上抛。
 */
const RO_LOOP_PATTERNS = [
  'ResizeObserver loop',
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded'
]

function isResizeObserverError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err ?? '')
  return RO_LOOP_PATTERNS.some(pattern => message.includes(pattern))
}

// 捕获阶段的 error 事件覆盖资源加载错误与跨域脚本错误，
// 因此不额外挂 window.onerror（两者对同一批错误重复生效）
window.addEventListener(
  'error',
  e => {
    if (isResizeObserverError(e.error || e.message)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  },
  true
)

window.addEventListener(
  'unhandledrejection',
  e => {
    if (isResizeObserverError(e.reason)) {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
  },
  true
)

const app = createApp(App)
app.use(router)
app.mount('#app')
