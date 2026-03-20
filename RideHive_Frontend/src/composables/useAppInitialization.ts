import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useAppInitialization() {
  const themeStore = useThemeStore()

  onMounted(() => {
    // Initialize theme on app mount
    themeStore.initializeTheme()
  })

  return {
    themeStore
  }
}