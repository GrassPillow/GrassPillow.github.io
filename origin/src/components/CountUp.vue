<template>
  <span class="count-up" ref="triggerRef">
    {{ displayValue }}{{ suffix }}
  </span>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCountUp } from '../composables/useAnimation.js'

const props = defineProps({
  end: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  suffix: {
    type: String,
    default: ''
  }
})

const triggerRef = ref(null)
const started = ref(false)

const { currentValue, start } = useCountUp(props.end, props.duration)

const displayValue = computed(() => currentValue.value)

// Start animation when element enters viewport
let observer = null
onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && triggerRef.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.value) {
          started.value = true
          start()
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(triggerRef.value)
  } else {
    started.value = true
    start()
  }
})
</script>
