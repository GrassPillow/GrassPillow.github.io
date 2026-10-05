/**
 * Toast 提示 composable
 * 提供全局的 Toast 提示功能
 */
export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    // 等待 Toast 组件初始化
    const tryShowToast = () => {
      if (window.$toast && window.$toast[type]) {
        window.$toast[type](message, duration)
      } else {
        // 如果 Toast 还没初始化，延迟重试
        setTimeout(() => {
          if (window.$toast && window.$toast[type]) {
            window.$toast[type](message, duration)
          } else {
            console.warn('Toast component not initialized, message:', message)
          }
        }, 100)
      }
    }
    
    tryShowToast()
  }

  return {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  }
}

