import { ref, readonly } from 'vue'

const THEME_KEY = 'grasspillow-theme'

// Theme state
const isDark = ref(false)

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

// Apply theme to document
const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

// Toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  applyTheme()
}

// Watch for system preference changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      isDark.value = e.matches
      applyTheme()
    }
  })
}

export function useTheme() {
  return {
    isDark: readonly(isDark),
    toggleTheme,
    initTheme
  }
}
