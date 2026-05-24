import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Intersection Observer based lazy loading composable
 * 用于检测元素是否进入视口
 */
export function useLazyLoad(options = {}) {
  const elementRef = ref(null)
  const isVisible = ref(false)
  const hasLoaded = ref(false)
  let observer = null

  const defaultOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
    ...options
  }

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        hasLoaded.value = true
        // 一旦加载就停止观察
        if (observer && elementRef.value) {
          observer.unobserve(elementRef.value)
        }
      }
    })
  }

  onMounted(() => {
    if (typeof IntersectionObserver !== 'undefined' && elementRef.value) {
      observer = new IntersectionObserver(onIntersect, defaultOptions)
      observer.observe(elementRef.value)
    } else {
      // 降级处理：如果浏览器不支持 IntersectionObserver，直接显示
      isVisible.value = true
      hasLoaded.value = true
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isVisible,
    hasLoaded
  }
}

/**
 * 图片懒加载指令
 * 使用方法：v-lazy-img="imageUrl"
 */
export const lazyImgDirective = {
  mounted(el, binding) {
    const { value } = binding

    // 设置占位符
    el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E'
    el.style.transition = 'opacity 0.3s ease'
    el.style.opacity = '0.5'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.onload = () => {
              el.src = value
              el.style.opacity = '1'
              observer.unobserve(el)
            }
            img.src = value
          }
        })
      },
      { rootMargin: '100px' }
    )

    observer.observe(el)
  }
}
