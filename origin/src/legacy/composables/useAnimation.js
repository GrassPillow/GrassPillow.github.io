import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 滚动动画组合式函数
 * 当元素进入视口时添加动画效果
 */
export function useScrollAnimation(options = {}) {
  const {
    type = 'fadeUp',
    duration = 0.6,
    delay = 0,
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options

  const elementRef = ref(null)
  const isVisible = ref(false)
  let observer = null

  // 动画类型映射
  const animationConfigs = {
    fadeUp: {
      from: 'translateY(40px)',
      to: 'translateY(0)'
    },
    fadeDown: {
      from: 'translateY(-40px)',
      to: 'translateY(0)'
    },
    fadeLeft: {
      from: 'translateX(40px)',
      to: 'translateX(0)'
    },
    fadeRight: {
      from: 'translateX(-40px)',
      to: 'translateX(0)'
    },
    zoom: {
      from: 'scale(0.8)',
      to: 'scale(1)'
    },
    flip: {
      from: 'perspective(400px) rotateX(-15deg)',
      to: 'perspective(400px) rotateX(0)'
    }
  }

  const applyAnimation = (show) => {
    if (!elementRef.value) return

    const config = animationConfigs[type]

    if (show) {
      elementRef.value.style.opacity = '1'
      elementRef.value.style.transform = config.to
      isVisible.value = true
    } else {
      elementRef.value.style.opacity = '0'
      elementRef.value.style.transform = config.from
    }
  }

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        applyAnimation(true)

        if (once && observer) {
          observer.unobserve(entry.target)
        }
      } else if (!once) {
        applyAnimation(false)
      }
    })
  }

  onMounted(() => {
    if (elementRef.value) {
      // 设置初始样式
      const config = animationConfigs[type]
      elementRef.value.style.opacity = '0'
      elementRef.value.style.transform = config.from
      elementRef.value.style.transition = `all ${duration}s ease ${delay}s`

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(onIntersect, {
          threshold,
          rootMargin
        })
        observer.observe(elementRef.value)
      } else {
        // 降级处理
        applyAnimation(true)
      }
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isVisible
  }
}

/**
 * 数字滚动动画
 * 从 0 滚动到目标数字
 */
export function useCountUp(endValue, duration = 2000) {
  const currentValue = ref(0)
  let animationFrame = null

  const start = () => {
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用 easeOutQuart 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      currentValue.value = Math.floor(easeProgress * endValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        currentValue.value = endValue
      }
    }

    animationFrame = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    currentValue,
    start,
    stop
  }
}

