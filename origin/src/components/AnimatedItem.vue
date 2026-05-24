<template>
  <div ref="elementRef">
    <slot />
  </div>
</template>

<script setup>
import { useScrollAnimation } from '../composables/useAnimation.js'

const props = defineProps({
  type: {
    type: String,
    default: 'fadeUp'
  },
  duration: {
    type: Number,
    default: 0.6
  },
  delay: {
    type: Number,
    default: 0
  },
  threshold: {
    type: Number,
    default: 0.1
  }
})

const { elementRef } = useScrollAnimation({
  type: props.type,
  duration: props.duration,
  delay: props.delay,
  threshold: props.threshold
})
</script>
