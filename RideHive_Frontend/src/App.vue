<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppInitialization } from '@/composables/useAppInitialization'

useAppInitialization()
</script>