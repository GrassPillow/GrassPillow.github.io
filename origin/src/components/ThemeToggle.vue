<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
  >
    <transition name="theme-icon" mode="out-in">
      <span v-if="isDark" key="moon" class="theme-icon">🌙</span>
      <span v-else key="sun" class="theme-icon">☀️</span>
    </transition>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  transform: scale(1.1);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon transition */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
