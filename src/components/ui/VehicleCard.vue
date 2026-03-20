<template>
  <RouterLink :to="`/vehicles/${id}`" class="group">
    <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div class="relative">
        <img :src="image" :alt="name" class="w-full h-48 object-cover" />
        <div v-if="isAI" class="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <BadgeCheck class="h-3 w-3 mr-1" />
          AI Smart Pick
        </div>
        <div class="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
          {{ type }}
        </div>
      </div>
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ name }}</h3>
          <div class="flex items-center">
            <Star class="h-4 w-4 text-yellow-500 mr-1" />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ rating }}</span>
          </div>
        </div>
        <div class="flex items-center space-x-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center">
            <Users class="h-4 w-4 mr-1" />
            <span>{{ seats }} seats</span>
          </div>
          <div v-if="isElectric" class="flex items-center">
            <Battery class="h-4 w-4 mr-1" />
            <span>Electric</span>
          </div>
          <div v-else class="flex items-center">
            <Gauge class="h-4 w-4 mr-1" />
            <span>Automatic</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div>
            <span class="text-lg font-bold text-teal-600">${{ price }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400"> /day</span>
          </div>
          <button class="text-sm text-teal-600 hover:text-teal-800 dark:hover:text-teal-400 font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Star, Users, Battery, Gauge, BadgeCheck } from 'lucide-vue-next'

defineProps<{
  id: string
  name: string
  image: string
  type: string
  price: number
  rating: number
  seats: number
  isAI?: boolean
  isElectric?: boolean
}>()
</script>
