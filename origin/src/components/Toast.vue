<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <teleport to="body">
    <transition-group name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
/* eslint-disable no-undef */
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const addToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastId
  const toast = { id, message, type }
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

// 暴露方法供外部调用
defineExpose({
  addToast,
  removeToast
})

// 全局方法
onMounted(() => {
  // 确保 window.$toast 存在
  if (!window.$toast) {
    window.$toast = {
      success: (message, duration) => addToast(message, 'success', duration),
      error: (message, duration) => addToast(message, 'error', duration),
      warning: (message, duration) => addToast(message, 'warning', duration),
      info: (message, duration) => addToast(message, 'info', duration)
    }
  }
})

onUnmounted(() => {
  // 只在没有其他 Toast 实例时删除
  if (window.$toast) {
    delete window.$toast
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.25rem;
  min-width: 280px;
  max-width: 400px;
  background: var(--c-bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(var(--c-shadow-rgb), 0.15),
              0 2px 8px rgba(var(--c-shadow-rgb), 0.1);
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  border-left: 4px solid;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 32px rgba(var(--c-shadow-rgb), 0.2),
              0 4px 12px rgba(var(--c-shadow-rgb), 0.15);
}

.toast.success {
  border-left-color: var(--c-success-base);
  color: var(--c-success-text);
}

.toast.error {
  border-left-color: var(--c-error-base);
  color: var(--c-error-text);
}

.toast.warning {
  border-left-color: var(--c-warning-base);
  color: var(--c-warning-text);
}

.toast.info {
  border-left-color: var(--c-info-base);
  color: var(--c-info-text);
}

.toast-icon {
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: var(--c-success-base);
}

.toast.error .toast-icon {
  color: var(--c-error-base);
}

.toast.warning .toast-icon {
  color: var(--c-warning-base);
}

.toast.info .toast-icon {
  color: var(--c-info-base);
}

.toast-message {
  flex: 1;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;
}

.toast-close:hover {
  background: var(--c-bg-warm);
  color: var(--c-text-secondary);
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* 响应式 */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    gap: 8px;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
    padding: 0.875rem 1rem;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-100px) scale(0.9);
  }
}
</style>

