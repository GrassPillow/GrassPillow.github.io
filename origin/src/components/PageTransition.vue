<template>
  <transition
    :name="name"
    :mode="mode"
    :appear="appear"
    :duration="duration"
  >
    <slot />
  </transition>
</template>

<script setup>
// 显式过渡时长：Vue 会以 setTimeout 兜底完成切换，
// 避免 transitionend 事件未触发（系统开启"减弱动态效果"或特殊渲染环境）导致 out-in 切换卡死
defineProps({
  name: {
    type: String,
    default: 'page'
  },
  mode: {
    type: String,
    default: 'out-in',
    validator: (value) => ['in-out', 'out-in', 'default'].includes(value)
  },
  appear: {
    type: Boolean,
    default: false
  },
  duration: {
    type: [Number, Object],
    default: () => ({ enter: 300, leave: 300 })
  }
})
</script>

<style>
/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Up Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Slide Left Transition */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Zoom Transition */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.4s ease;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Flip Transition */
.flip-enter-active {
  animation: flip-in 0.5s ease;
}

.flip-leave-active {
  animation: flip-out 0.5s ease;
}

@keyframes flip-in {
  0% {
    opacity: 0;
    transform: perspective(400px) rotateY(90deg);
  }
  100% {
    opacity: 1;
    transform: perspective(400px) rotateY(0);
  }
}

@keyframes flip-out {
  0% {
    opacity: 1;
    transform: perspective(400px) rotateY(0);
  }
  100% {
    opacity: 0;
    transform: perspective(400px) rotateY(-90deg);
  }
}

/* Bounce Transition */
.bounce-enter-active {
  animation: bounce-in 0.5s ease;
}

.bounce-leave-active {
  animation: bounce-out 0.4s ease;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
