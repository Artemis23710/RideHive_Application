<template>
  <DashboardLayout user-type="admin">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Overview of your business performance and operations
      </p>
    </div>
    
    <!-- KPI cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="(kpi, index) in kpis" :key="index">
        <CardContent class="p-6">
          <div class="flex justify-between items-center">
            <div class="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
              <component
                :is="kpi.icon"
                class="h-6 w-6 text-teal-600 dark:text-teal-400"
              />
            </div>
            <span
              :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                kpi.positive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`"
            >
              {{ kpi.change }}
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ kpi.title }}
            </h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ kpi.value }}
            </p>
          </div>
        </CardContent>
      </BaseCard>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Fleet status card -->
      <BaseCard class="lg:col-span-1">
        <CardHeader>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Fleet Status
          </h2>
        </CardHeader>
        <CardContent class="p-6">
          <!-- Available progress bar -->
          <div class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400">
                  Available
                </span>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold inline-block text-teal-600 dark:text-teal-400">
                  {{ Math.round(fleetStatus.available / fleetStatus.total * 100) }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200 dark:bg-teal-900/20">
              <div
                :style="{ width: `${fleetStatus.available / fleetStatus.total * 100}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 dark:bg-teal-400"
              ></div>
            </div>
          </div>
          
          <!-- Booked progress bar -->
          <div class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  Booked
                </span>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                  {{ Math.round(fleetStatus.booked / fleetStatus.total * 100) }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/20">
              <div
                :style="{ width: `${fleetStatus.booked / fleetStatus.total * 100}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400"
              ></div>
            </div>
          </div>
          
          <!-- Maintenance progress bar -->
          <div class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Maintenance
                </span>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold inline-block text-yellow-600 dark:text-yellow-400">
                  {{ Math.round(fleetStatus.maintenance / fleetStatus.total * 100) }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200 dark:bg-yellow-900/20">
              <div
                :style="{ width: `${fleetStatus.maintenance / fleetStatus.total * 100}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 dark:bg-yellow-400"
              ></div>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ fleetStatus.available }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Available
              </p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ fleetStatus.booked }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Booked
              </p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ fleetStatus.maintenance }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Maintenance
              </p>
            </div>
          </div>
        </CardContent>
      </BaseCard>
      
      <!-- Revenue chart card -->
      <BaseCard class="lg:col-span-2">
        <CardHeader class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Revenue Overview
          </h2>
          <div class="flex space-x-2">
            <BaseButton variant="outline" size="sm">
              Weekly
            </BaseButton>
            <BaseButton size="sm">
              Monthly
            </BaseButton>
          </div>
        </CardHeader>
        <CardContent class="p-6">
          <div class="h-64 flex items-center justify-center">
            <BarChart3Icon class="h-16 w-16 text-gray-300 dark:text-gray-700" />
            <p class="ml-4 text-gray-500 dark:text-gray-400">
              Chart visualization would appear here
            </p>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                $86,429
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Avg. Booking Value
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                $230
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Conversion Rate
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                24.3%
              </p>
            </div>
          </div>
        </CardContent>
      </BaseCard>
    </div>
    
    <!-- Recent bookings -->
    <BaseCard class="mb-8">
      <CardHeader class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Recent Bookings
        </h2>
        <BaseButton variant="outline" size="sm">
          View All
        </BaseButton>
      </CardHeader>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Booking ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vehicle
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="booking in recentBookings" :key="booking.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ booking.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-full"
                      :src="booking.avatar"
                      :alt="booking.customer"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ booking.customer }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ booking.vehicle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ booking.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ booking.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`"
                >
                  <component
                    :is="booking.status === 'confirmed' ? CheckCircleIcon : booking.status === 'pending' ? AlertCircleIcon : XCircleIcon"
                    class="mr-1 h-3 w-3"
                  />
                  {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <BaseButton variant="ghost" size="sm">
                  View
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
    
    <!-- Quick actions -->
    <BaseCard>
      <CardHeader>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Quick Actions
        </h2>
      </CardHeader>
      <CardContent class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BaseButton class="flex flex-col items-center justify-center h-24 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
            <CarIcon class="h-6 w-6 mb-2 text-teal-600 dark:text-teal-400" />
            <span>Add Vehicle</span>
          </BaseButton>
          <BaseButton class="flex flex-col items-center justify-center h-24 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
            <CalendarIcon class="h-6 w-6 mb-2 text-teal-600 dark:text-teal-400" />
            <span>Add Tour</span>
          </BaseButton>
          <BaseButton class="flex flex-col items-center justify-center h-24 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
            <UsersIcon class="h-6 w-6 mb-2 text-teal-600 dark:text-teal-400" />
            <span>User Management</span>
          </BaseButton>
          <BaseButton class="flex flex-col items-center justify-center h-24 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
            <BarChart3Icon class="h-6 w-6 mb-2 text-teal-600 dark:text-teal-400" />
            <span>Generate Report</span>
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  BarChart3Icon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  CarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon
} from 'lucide-vue-next'

// Sample KPI data
const kpis = ref([
  {
    title: 'Total Bookings',
    value: '1,248',
    change: '+12.5%',
    icon: CalendarIcon,
    positive: true
  },
  {
    title: 'Total Revenue',
    value: '$86,429',
    change: '+8.2%',
    icon: TrendingUpIcon,
    positive: true
  },
  {
    title: 'Active Users',
    value: '3,427',
    change: '+24.3%',
    icon: UsersIcon,
    positive: true
  },
  {
    title: 'Fleet Utilization',
    value: '78%',
    change: '-2.1%',
    icon: CarIcon,
    positive: false
  }
])

// Sample recent bookings data
const recentBookings = ref([
  {
    id: 'BK-7829',
    customer: 'Alex Johnson',
    vehicle: 'Tesla Model 3',
    date: 'Oct 12 - Oct 15, 2023',
    amount: '$385',
    status: 'confirmed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'BK-7830',
    customer: 'Michael Smith',
    vehicle: 'Jeep Wrangler',
    date: 'Nov 5 - Nov 10, 2023',
    amount: '$750',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'BK-7831',
    customer: 'Sarah Williams',
    vehicle: 'BMW X5',
    date: 'Oct 15 - Oct 18, 2023',
    amount: '$520',
    status: 'cancelled',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: 'BK-7832',
    customer: 'James Brown',
    vehicle: 'Mercedes E-Class',
    date: 'Oct 20 - Oct 25, 2023',
    amount: '$680',
    status: 'confirmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  }
])

// Sample fleet status data
const fleetStatus = ref({
  available: 32,
  booked: 18,
  maintenance: 5,
  total: 55
})
</script>