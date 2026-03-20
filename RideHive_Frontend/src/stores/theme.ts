import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

export type ThemeType = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeType>('light')

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') as ThemeType
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    theme.value = savedTheme || (prefersDark ? 'dark' : 'light')
    applyTheme(theme.value)
  }

  const applyTheme = (newTheme: ThemeType) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Watch for theme changes and apply them
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    initializeTheme,
    toggleTheme
  }
})