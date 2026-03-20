<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Overview of your fleet and booking operations</p>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-2">
        <AppButton>
          <Car class="h-4 w-4 mr-2" />
          Add Vehicle
        </AppButton>
        <AppButton variant="secondary">Generate Report</AppButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="(kpi, index) in kpis" :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ kpi.title }}</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.value }}</h3>
          </div>
          <div class="rounded-full bg-gray-100 dark:bg-gray-700 p-3">
            <component :is="kpi.icon" :class="['h-6 w-6', kpi.iconColor]" />
          </div>
        </div>
        <div :class="['text-sm', kpi.positive ? 'text-green-600' : 'text-red-600']">
          {{ kpi.change }} from last month
        </div>
      </div>
    </div>

    <!-- Bar Chart (vue-chartjs) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Trends</h2>
      <div class="h-80">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Alerts -->
      <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h2>
          <AppButton variant="ghost" size="sm">View All</AppButton>
        </div>
        <div class="space-y-4">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-r-lg"
          >
            <div class="flex">
              <AlertCircle class="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ alert.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ alert.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ alert.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings Table -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          <AppButton variant="ghost" size="sm">View All</AppButton>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th v-for="col in tableColumns" :key="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="booking in recentBookings" :key="booking.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ booking.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ booking.customer }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ booking.vehicle }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(booking.startDate) }} – {{ formatDate(booking.endDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="['text-xs px-2 py-1 rounded-full', booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400']">
                    {{ capitalize(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ booking.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- AI Pricing Suggestions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div class="flex items-center mb-4">
        <div class="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full mr-3">
          <TrendingUp class="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">AI Pricing Suggestions</h2>
      </div>
      <div class="p-4 border border-teal-200 dark:border-teal-900/50 rounded-lg bg-teal-50 dark:bg-teal-900/10">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Based on historical data and upcoming events, our AI suggests the following price adjustments:
        </p>
        <ul class="space-y-2 mb-4">
          <li v-for="suggestion in aiSuggestions" :key="suggestion.text" class="flex items-start">
            <span :class="['text-xs px-2 py-1 rounded-full mr-2', suggestion.positive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400']">
              {{ suggestion.change }}
            </span>
            <span class="text-gray-700 dark:text-gray-300">{{ suggestion.text }}</span>
          </li>
        </ul>
        <div class="flex space-x-2">
          <AppButton size="sm">Apply All</AppButton>
          <AppButton variant="outline" size="sm">Review Details</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Car, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-vue-next'
import AppButton from '../../components/ui/AppButton.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const tableColumns = ['ID', 'Customer', 'Vehicle', 'Dates', 'Status', 'Amount']

const kpis = [
  { title: 'Total Bookings', value: '1,254', change: '+12%', positive: true, icon: Car, iconColor: 'text-teal-600' },
  { title: 'Active Users', value: '842', change: '+5%', positive: true, icon: Users, iconColor: 'text-blue-600' },
  { title: 'Revenue', value: '$84,210', change: '+18%', positive: true, icon: DollarSign, iconColor: 'text-green-600' },
  { title: 'Fleet Utilization', value: '78%', change: '-2%', positive: false, icon: TrendingUp, iconColor: 'text-orange-600' },
]

const bookingData = [
  { name: 'Jan', bookings: 40 },
  { name: 'Feb', bookings: 30 },
  { name: 'Mar', bookings: 45 },
  { name: 'Apr', bookings: 50 },
  { name: 'May', bookings: 65 },
  { name: 'Jun', bookings: 75 },
  { name: 'Jul', bookings: 85 },
]

const chartData = computed(() => ({
  labels: bookingData.map((d) => d.name),
  datasets: [
    {
      label: 'Bookings',
      data: bookingData.map((d) => d.bookings),
      backgroundColor: '#008080',
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
    x: { grid: { display: false } },
  },
}

const alerts = [
  { id: '1', title: 'Low Inventory Alert', message: 'SUV category is running low on available vehicles for the upcoming weekend.', time: '10 minutes ago' },
  { id: '2', title: 'New AI Price Suggestion', message: 'AI suggests increasing weekend rates by 8% based on demand forecast.', time: '1 hour ago' },
  { id: '3', title: 'Maintenance Required', message: 'Vehicle #A123 is due for maintenance check before next booking.', time: '3 hours ago' },
]

const recentBookings = [
  { id: 'B1001', customer: 'Alex Johnson', vehicle: 'Tesla Model 3', startDate: '2023-11-30', endDate: '2023-12-05', status: 'confirmed', amount: '$445' },
  { id: 'B1002', customer: 'Sarah Williams', vehicle: 'Jeep Wrangler', startDate: '2023-12-01', endDate: '2023-12-03', status: 'pending', amount: '$225' },
  { id: 'B1003', customer: 'Michael Chen', vehicle: 'BMW 3 Series', startDate: '2023-12-02', endDate: '2023-12-06', status: 'confirmed', amount: '$550' },
]

const aiSuggestions = [
  { change: '+12%', text: 'SUVs during the upcoming holiday weekend (Dec 24–26)', positive: true },
  { change: '-8%', text: 'Sedans during weekdays next month to increase utilization', positive: false },
  { change: '+5%', text: 'All luxury vehicles due to increased demand', positive: true },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>
