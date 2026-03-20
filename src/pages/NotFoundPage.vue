<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-bold text-teal-600">404</h1>
      <h2 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-6">
        <RouterLink to="/">
          <AppButton class="inline-flex items-center">
            <Home class="h-5 w-5 mr-2" />
            Back to home
          </AppButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'
import AppButton from '../components/ui/AppButton.vue'
</script>
