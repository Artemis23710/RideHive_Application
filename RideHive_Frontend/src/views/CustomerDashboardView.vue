<template>
  <DashboardLayout user-type="customer">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, Alex
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Here's what's happening with your bookings
      </p>
    </div>
    
    <!-- Search section -->
    <BaseCard class="mb-8">
      <CardContent class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Find your next ride
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <MapPinIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              class="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div class="relative">
            <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Pick-up date"
              class="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div class="relative">
            <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Return date"
              class="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div class="relative">
            <CarIcon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select class="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>Any vehicle type</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Luxury</option>
              <option>Electric</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <BaseButton>
            <SearchIcon class="h-4 w-4 mr-2" />
            Search
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>
    
    <!-- Upcoming bookings section -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Upcoming bookings
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <BaseCard
        v-for="booking in upcomingBookings"
        :key="booking.id"
        class="overflow-hidden"
      >
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3">
            <img
              :src="booking.imageUrl"
              :alt="booking.vehicleName"
              class="h-full w-full object-cover"
            />
          </div>
          
          <div class="md:w-2/3 p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ booking.vehicleName }}
            </h3>
            
            <div class="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon class="h-4 w-4 mr-1" />
              {{ booking.dateRange }}
            </div>
            
            <div class="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon class="h-4 w-4 mr-1" />
              {{ booking.location }}
            </div>
            
            <div class="mt-4 flex space-x-2">
              <span
                :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`"
              >
                {{ booking.status === 'confirmed' ? 'Confirmed' : 'Pending' }}
              </span>
            </div>
            
            <div class="mt-4 flex justify-end space-x-2">
              <BaseButton variant="outline" size="sm">
                View Details
              </BaseButton>
              <BaseButton size="sm">
                Manage
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Recommended vehicles section -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Recommended for you
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="vehicle in recommendedVehicles"
        :key="vehicle.id"
        class="overflow-hidden"
      >
        <img
          :src="vehicle.imageUrl"
          :alt="vehicle.name"
          class="h-48 w-full object-cover"
        />
        
        <CardContent class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ vehicle.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ vehicle.type }}
              </p>
            </div>
            
            <div class="flex items-center bg-teal-100 dark:bg-teal-900 px-2 py-1 rounded-full">
              <svg
                class="h-4 w-4 text-teal-600 dark:text-teal-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 15.585l-5.657 3.873 1.09-6.343L.868 8.424l6.364-.925L10 2l2.768 5.499 6.364.925-4.565 4.691 1.09 6.343L10 15.585z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="ml-1 text-sm font-medium text-teal-800 dark:text-teal-200">
                {{ vehicle.rating }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              ${{ vehicle.price }}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-400">
                /day
              </span>
            </span>
            <BaseButton size="sm">
              Book Now
            </BaseButton>
          </div>
        </CardContent>
      </BaseCard>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import CardContent from '@/components/ui/CardContent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  SearchIcon,
  CalendarIcon,
  MapPinIcon,
  CarIcon
} from 'lucide-vue-next'

// Sample data for upcoming bookings
const upcomingBookings = ref([
  {
    id: 1,
    vehicleName: 'Tesla Model 3',
    dateRange: 'Oct 12 - Oct 15, 2023',
    location: 'San Francisco, CA',
    status: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1562053828-91a51c74eb19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    vehicleName: 'Jeep Wrangler',
    dateRange: 'Nov 5 - Nov 10, 2023',
    location: 'Denver, CO',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
])

// Sample data for recommended vehicles
const recommendedVehicles = ref([
  {
    id: 1,
    name: 'BMW X5',
    type: 'SUV',
    price: 120,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e8f2e928464?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Mercedes E-Class',
    type: 'Sedan',
    price: 95,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1549275301-41008ba12aca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Toyota Prius',
    type: 'Hybrid',
    price: 65,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
])
</script>