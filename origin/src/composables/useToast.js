/**
 * Toast 提示 composable
 * 提供全局的 Toast 提示功能
 *
 * 使用事件驱动方式等待 Toast 组件就绪，避免轮询
 */
const TOAST_READY_EVENT = 'toast:ready'
const pendingQueue = []
let isToastReady = false

// Listen for Toast component ready signal
if (typeof window !== 'undefined') {
  window.addEventListener(TOAST_READY_EVENT, () => {
    isToastReady = true
    pendingQueue.forEach(({ message, type, duration }) => {
      if (window.$toast?.[type]) {
        window.$toast[type](message, duration)
      }
    })
    pendingQueue.length = 0
  }, { once: true })
}

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    if (isToastReady && window.$toast?.[type]) {
      window.$toast[type](message, duration)
    } else if (window.$toast?.[type]) {
      // Toast ready but no event received yet
      window.$toast[type](message, duration)
      isToastReady = true
    } else {
      // Queue message until Toast is ready
      pendingQueue.push({ message, type, duration })
    }
  }

  return {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  }
}

