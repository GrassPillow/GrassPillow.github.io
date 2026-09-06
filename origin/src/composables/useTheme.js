import { ref, readonly } from 'vue'

const THEME_KEY = 'grasspillow-theme'

// Theme state
const isDark = ref(false)
let systemPreferenceListener = null

// Apply theme to document
const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

// Handle system preference change
const onSystemPreferenceChange = (e) => {
  // Only follow system preference when user hasn't explicitly set a theme
  if (!localStorage.getItem(THEME_KEY)) {
    isDark.value = e.matches
    applyTheme()
  }
}

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()

  // Register system preference listener only during init, not at module load time
  if (!systemPreferenceListener) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', onSystemPreferenceChange)
    systemPreferenceListener = { mediaQuery, handler: onSystemPreferenceChange }
  }
}

// Clean up listener when no longer needed
const destroyTheme = () => {
  if (systemPreferenceListener) {
    systemPreferenceListener.mediaQuery.removeEventListener(
      'change',
      systemPreferenceListener.handler
    )
    systemPreferenceListener = null
  }
}

// Toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  applyTheme()
}

// Set specific theme
const setTheme = (dark) => {
  isDark.value = dark
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  applyTheme()
}

export function useTheme() {
  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    initTheme,
    destroyTheme
  }
}
