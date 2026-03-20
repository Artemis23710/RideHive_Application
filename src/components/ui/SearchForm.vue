<template>
  <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Location -->
      <div class="md:col-span-1">
        <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="location"
            v-model="form.location"
            placeholder="Where are you going?"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <!-- Start Date -->
      <div class="md:col-span-1">
        <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="startDate"
            v-model="form.startDate"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <!-- End Date -->
      <div class="md:col-span-1">
        <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="endDate"
            v-model="form.endDate"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <!-- Vehicle Type -->
      <div class="md:col-span-1">
        <label for="vehicleType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Car class="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="vehicleType"
            v-model="form.vehicleType"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Any Type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury</option>
            <option value="convertible">Convertible</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div class="md:col-span-1 flex items-end">
        <AppButton type="submit" full-width class="h-10 mt-6">
          <Search class="h-5 w-5 mr-2" />
          Search
        </AppButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { MapPin, Calendar, Car, Search } from 'lucide-vue-next'
import AppButton from './AppButton.vue'

const form = reactive({
  location: '',
  startDate: '',
  endDate: '',
  vehicleType: '',
})

function handleSubmit() {
  console.log('Search params:', form)
}
</script>
