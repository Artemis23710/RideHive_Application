<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2">
          <Car class="h-8 w-8 text-teal-600" />
          <span class="text-xl font-bold text-teal-600">Ride Hive</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav v-if="!minimal" class="hidden md:flex items-center space-x-8">
          <a href="/#home" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Home</a>
          <a href="/#about" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">About</a>
          <a href="/#vehicles" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Vehicles</a>
          <a href="/#tours" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Tours</a>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center space-x-4">
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            :aria-label="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`"
          >
            <Moon v-if="themeStore.theme === 'light'" class="h-5 w-5 text-gray-600" />
            <Sun v-else class="h-5 w-5 text-gray-300" />
          </button>

          <div v-if="!minimal" class="hidden md:flex items-center space-x-4">
            <RouterLink to="/login">
              <AppButton variant="secondary">Log in</AppButton>
            </RouterLink>
            <RouterLink to="/register">
              <AppButton>Sign up</AppButton>
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            v-if="!minimal"
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" class="h-6 w-6" />
            <Menu v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen && !minimal" class="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
        <a href="/#home" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Home</a>
        <a href="/#about" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">About</a>
        <a href="/#vehicles" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Vehicles</a>
        <a href="/#tours" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Tours</a>
        <div class="px-4 pt-2 flex flex-col space-y-2">
          <RouterLink to="/login" @click="mobileMenuOpen = false">
            <AppButton variant="secondary" full-width>Log in</AppButton>
          </RouterLink>
          <RouterLink to="/register" @click="mobileMenuOpen = false">
            <AppButton full-width>Sign up</AppButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Car, Moon, Sun, Menu, X } from 'lucide-vue-next'
import { useThemeStore } from '../../stores/theme'
import AppButton from '../ui/AppButton.vue'

defineProps<{ minimal?: boolean }>()

const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)
</script>
