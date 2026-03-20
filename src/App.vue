<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
    <Navbar :minimal="isMinimal" />
    <main class="flex-grow">
      <RouterView />
    </main>
    <Footer v-if="!isMinimal" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'

const route = useRoute()
const isMinimal = computed(() => !!route.meta.minimal)
</script>
