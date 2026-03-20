<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="p-4 flex justify-between items-center">
      <Logo size="md" />
      <ThemeToggle />
    </header>
    
    <!-- Main content - centered -->
    <main class="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ title }}
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
        <slot />
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
      &copy; {{ new Date().getFullYear() }} RideHive. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Welcome to RideHive',
  subtitle: 'Your AI-powered vehicle rental platform'
})
</script>