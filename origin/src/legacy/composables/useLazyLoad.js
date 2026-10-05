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
            img.onerror = () => {
              // 加载失败时显示一个中性的失败占位，不再停留在半透明状态
              el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" font-size="20" text-anchor="middle" dominant-baseline="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E'
              el.style.opacity = '1'
              observer.unobserve(el)
            }
            img.src = value
          }
        })
      },
      { rootMargin: '100px' }
    )

    // 挂载到元素上，供 unmounted 清理
    el._lazyObserver = observer
    observer.observe(el)
  },
  unmounted(el) {
    // 路由离开时断开观察器，避免泄漏
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      el._lazyObserver = null
    }
  }
}
