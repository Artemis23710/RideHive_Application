<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Alex</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your bookings and explore new adventures</p>
      </div>
      <div class="mt-4 md:mt-0">
        <AppButton>
          <Car class="h-4 w-4 mr-2" />
          New Booking
        </AppButton>
      </div>
    </div>

    <!-- Quick Search -->
    <div class="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Search</h2>
      <SearchForm />
    </div>

    <!-- Upcoming Bookings -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Upcoming Bookings</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div
        v-for="booking in upcomingBookings"
        :key="booking.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3">
            <img :src="booking.image" :alt="booking.vehicleName" class="w-full h-full object-cover" />
          </div>
          <div class="p-4 md:w-2/3">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ booking.vehicleName }}</h3>
              <span :class="['text-xs px-2 py-1 rounded-full', booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400']">
                {{ capitalize(booking.status) }}
              </span>
            </div>
            <div class="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center">
                <CalendarIcon class="h-4 w-4 mr-2 text-gray-500" />
                <span>{{ formatDate(booking.startDate) }} – {{ formatDate(booking.endDate) }}</span>
              </div>
              <div class="flex items-center">
                <MapPin class="h-4 w-4 mr-2 text-gray-500" />
                <span>{{ booking.location }}</span>
              </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div>
                <span class="font-bold text-teal-600">${{ booking.price }}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400"> total</span>
              </div>
              <AppButton variant="secondary" size="sm">View Details</AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="activity in recentActivity" :key="activity.id" class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ activity.action }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ activity.description }}</p>
            </div>
            <div class="text-sm text-gray-500 flex items-center">
              <Clock class="h-4 w-4 mr-1" />
              <span>{{ activity.date }}, {{ activity.time }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Recommendations -->
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
      <div class="flex flex-col md:flex-row items-center">
        <img
          src="https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=2070&q=80"
          alt="City Explorer Tour"
          class="w-full md:w-1/4 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">City Explorer Tour</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Based on your previous bookings, you might enjoy our guided city tour package.
          </p>
          <AppButton variant="outline" size="sm">Learn More</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Car, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-vue-next'
import AppButton from '../../components/ui/AppButton.vue'
import SearchForm from '../../components/ui/SearchForm.vue'

const upcomingBookings = [
  {
    id: '1',
    vehicleName: 'Tesla Model 3',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=2071&q=80',
    startDate: '2023-12-15',
    endDate: '2023-12-20',
    location: 'San Francisco, CA',
    status: 'confirmed',
    price: 445,
  },
  {
    id: '2',
    vehicleName: 'Jeep Wrangler',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2070&q=80',
    startDate: '2024-01-10',
    endDate: '2024-01-15',
    location: 'Denver, CO',
    status: 'pending',
    price: 375,
  },
]

const recentActivity = [
  { id: '1', action: 'Booking Confirmed', description: 'Your booking for Tesla Model 3 has been confirmed.', date: '2023-11-30', time: '14:30' },
  { id: '2', action: 'Payment Processed', description: 'Payment of $445 has been processed successfully.', date: '2023-11-30', time: '14:25' },
  { id: '3', action: 'Tour Recommended', description: 'Based on your preferences, we recommend the City Explorer Tour.', date: '2023-11-29', time: '09:15' },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>
