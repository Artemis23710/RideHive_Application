<template>
  <DashboardLayout user-type="admin">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Tour Management
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage tour packages, routes, and scheduling
          </p>
        </div>
        <div class="flex space-x-3">
          <BaseButton variant="outline">
            <DownloadIcon class="h-4 w-4 mr-2" />
            Export
          </BaseButton>
          <BaseButton @click="openAddTourModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Create Tour
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Tour Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="(stat, index) in tourStats" :key="index">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="p-3 rounded-lg" :class="stat.bgColor">
              <component
                :is="stat.icon"
                class="h-6 w-6"
                :class="stat.iconColor"
              />
            </div>
            <span
              :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stat.positive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`"
            >
              {{ stat.change }}
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.title }}
            </h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
          </div>
        </CardContent>
      </BaseCard>
    </div>

    <!-- Filters and Search -->
    <BaseCard class="mb-6">
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search tours..."
            full-width
            :left-icon="SearchIcon"
          />
          
          <div class="relative">
            <select v-model="selectedCustomer" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Customers</option>
              <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          
          <div class="relative">
            <select v-model="selectedLocation" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Locations</option>
              <option value="sigiriya">Sigiriya</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
              <option value="ella">Ella</option>
            </select>
          </div>
          
          <div class="relative">
            <input 
              v-model="selectedDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <BaseButton variant="outline" @click="fetchTours">
            <FilterIcon class="h-4 w-4 mr-2" />
            More Filters
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>

    <!-- Tours Grid/Table Toggle -->
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Tours ({{ tours.length }})
      </h2>
      <div class="flex items-center space-x-2">
      </div>
    </div>


    <!-- Table View -->
    <div>
      <BaseCard>
        <CardHeader class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Tours ({{ filteredTours.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <BaseButton variant="outline" size="sm" @click="fetchTours" :disabled="isLoading">
              <RefreshCwIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
              Refresh
            </BaseButton>
          </div>
        </CardHeader>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tour Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Passengers
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Time
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Price
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="tour in paginatedTours" :key="tour._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ tour.tourname }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ tour.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ getCustomerName(tour.customer_id) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <MapPinIcon class="h-4 w-4 mr-1" />
                    {{ tour.locations }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <UsersIcon class="h-4 w-4 mr-1" />
                    {{ tour.passenger_count }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <ClockIcon class="h-4 w-4 mr-1" />
                    {{ tour.starttime }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Rs {{ tour.totalprice }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1 max-w-xs">
                    <span
                      v-for="(date, idx) in tour.tourSchedule.slice(0, 2)"
                      :key="idx"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                    >
                      {{ formatDate(date) }}
                    </span>
                    <span
                      v-if="tour.tourSchedule.length > 2"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      +{{ tour.tourSchedule.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="openEditTourModal(tour._id)" class="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300">
                      <EditIcon class="h-5 w-5" />
                    </button>
                    <button @click="confirmDeleteTour(tour._id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div class="flex-1 flex justify-between sm:hidden">
            <BaseButton variant="outline" size="sm" @click="prevPage" :disabled="currentPage === 1">Previous</BaseButton>
            <BaseButton variant="outline" size="sm" @click="nextPage" :disabled="currentPage >= totalPages">Next</BaseButton>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTours.length) }}</span> of
                <span class="font-medium">{{ filteredTours.length }}</span> tours
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <BaseButton variant="outline" size="sm" @click="prevPage" :disabled="currentPage === 1">Previous</BaseButton>
                <BaseButton 
                  v-for="page in totalPages" 
                  :key="page"
                  :variant="currentPage === page ? 'primary' : 'outline'" 
                  size="sm" 
                  class="mx-1"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </BaseButton>
                <BaseButton variant="outline" size="sm" @click="nextPage" :disabled="currentPage >= totalPages">Next</BaseButton>
              </nav>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Add/Edit Tour Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showTourModal"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeTourModal"
        >
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeTourModal"></div>
            <div class="relative w-full max-w-4xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ isEditMode ? 'Edit Tour' : 'Create New Tour' }}
                </h3>
                <button @click="closeTourModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XIcon class="h-5 w-5" />
                </button>
              </div>

              <form @submit.prevent="handleSubmitTour" class="px-6 py-4">
                <div class="space-y-6">
                  <!-- Basic Information -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tour Name <span class="text-red-500">*</span>
                        </label>
                        <BaseInput v-model="tourForm.tourname" placeholder="e.g., Sigiriya & Dambulla Day Tour" full-width required />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Customer <span class="text-red-500">*</span>
                        </label>
                        <select v-model="tourForm.customer_id" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">Select customer</option>
                          <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                            {{ customer.name }} - {{ customer.phone }}
                          </option>
                        </select>
                      </div>

                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description <span class="text-red-500">*</span>
                        </label>
                        <textarea 
                          v-model="tourForm.description" 
                          rows="3"
                          placeholder="Describe the tour highlights and itinerary..."
                          required 
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        ></textarea>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Locations <span class="text-red-500">*</span>
                        </label>
                        <BaseInput v-model="tourForm.locations" placeholder="e.g., Sigiriya, Dambulla, Minneriya" full-width required />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Passenger Count <span class="text-red-500">*</span>
                        </label>
                        <BaseInput v-model="tourForm.passenger_count" type="number" min="1" placeholder="e.g., 4" full-width required />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pickup Location <span class="text-red-500">*</span>
                        </label>
                        <BaseInput v-model="tourForm.pickup_locations" placeholder="e.g., Colombo Airport" full-width required />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Time <span class="text-red-500">*</span>
                        </label>
                        <input 
                          v-model="tourForm.starttime" 
                          type="time"
                          required 
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Total Price (Rs) <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
                          <input 
                            v-model="tourForm.totalprice" 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            required 
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tour Schedule -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Tour Schedule</h4>
                    <div class="space-y-4">
                      <div class="flex items-end gap-4">
                        <div class="flex-1">
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Add Tour Date
                          </label>
                          <input 
                            v-model="newTourDate" 
                            type="date"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <BaseButton type="button" @click="addTourDate">
                          <PlusIcon class="h-4 w-4 mr-2" />
                          Add Date
                        </BaseButton>
                      </div>

                      <div v-if="tourForm.tourSchedule.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Selected Dates ({{ tourForm.tourSchedule.length }})
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="(date, idx) in tourForm.tourSchedule"
                            :key="idx"
                            class="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                          >
                            {{ formatDate(date) }}
                            <button 
                              type="button"
                              @click="removeTourDate(idx)" 
                              class="ml-2 hover:text-teal-900 dark:hover:text-teal-100"
                            >
                              <XIcon class="h-4 w-4" />
                            </button>
                          </span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Add all the dates when this tour will be available
                      </p>
                    </div>
                  </div>

                  <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <BaseButton type="button" variant="outline" @click="closeTourModal">Cancel</BaseButton>
                  <BaseButton type="submit" :disabled="isLoading">
                    <PlusIcon v-if="!isEditMode" class="h-4 w-4 mr-2" />
                    <EditIcon v-else class="h-4 w-4 mr-2" />
                    {{ isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Tour' : 'Create Tour') }}
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDeleteConfirm">
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeDeleteConfirm"></div>
            <div class="relative w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
              <div class="p-6">
                <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
                  <TrashIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 class="mt-4 text-lg font-semibold text-center text-gray-900 dark:text-white">Delete Tour</h3>
                <p class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this tour? This action cannot be undone.
                </p>
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                </div>
                <div class="mt-6 flex justify-center space-x-3">
                  <BaseButton type="button" variant="outline" @click="closeDeleteConfirm" :disabled="isDeleting">Cancel</BaseButton>
                  <BaseButton type="button" class="bg-red-600 hover:bg-red-700 text-white" @click="deleteTour" :disabled="isDeleting">
                    <TrashIcon class="h-4 w-4 mr-2" />
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import {
  MapIcon,
  TrendingUpIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EditIcon,
  GridIcon,
  ListIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
  XIcon,
  RefreshCwIcon
} from 'lucide-vue-next'

const viewMode = ref('table')
const searchQuery = ref('')
const selectedCustomer = ref('')
const selectedLocation = ref('')
const selectedDate = ref('')
const showTourModal = ref(false)
const showDeleteConfirm = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const isEditMode = ref(false)
const editingTourId = ref<string | null>(null)
const deletingTourId = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const newTourDate = ref('')

const tours = ref<any[]>([])
const customers = ref<any[]>([])

const tourForm = ref({
  customer_id: '',
  tourname: '',
  description: '',
  locations: '',
  passenger_count: '',
  totalprice: '',
  tourSchedule: [] as string[],
  starttime: '',
  pickup_locations: ''
})

const filteredTours = computed(() => {
  let filtered = tours.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tour => {
      // Search in tour fields
      const tourMatch = tour.tourname?.toLowerCase().includes(query) || 
                        tour.description?.toLowerCase().includes(query) ||
                        tour.locations?.toLowerCase().includes(query)
      
      // Also search in customer name if populated
      const customerName = getCustomerName(tour.customer_id).toLowerCase()
      const customerMatch = customerName.includes(query)
      
      return tourMatch || customerMatch
    })
  }
  
  if (selectedCustomer.value) {
    filtered = filtered.filter(tour => {
      // Handle populated customer object
      if (tour.customer_id && typeof tour.customer_id === 'object') {
        return tour.customer_id._id === selectedCustomer.value
      }
      // Handle customer ID string
      return tour.customer_id === selectedCustomer.value
    })
  }
  
  if (selectedLocation.value) {
    filtered = filtered.filter(tour => 
      tour.locations?.toLowerCase().includes(selectedLocation.value.toLowerCase())
    )
  }
  
  if (selectedDate.value) {
    filtered = filtered.filter(tour => 
      tour.tourSchedule?.includes(selectedDate.value)
    )
  }
  
  return filtered
})

const paginatedTours = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTours.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTours.value.length / itemsPerPage.value)
})

const tourStats = computed(() => {
  const totalTours = tours.value.length
  const totalRevenue = tours.value.reduce((sum, tour) => sum + (tour.totalprice || 0), 0)
  const totalPassengers = tours.value.reduce((sum, tour) => sum + parseInt(tour.passenger_count || 0), 0)
  const upcomingTours = tours.value.filter(tour => {
    const today = new Date().toISOString().split('T')[0]
    return tour.tourSchedule?.some((date: string) => date >= today)
  }).length

  return [
    {
      title: 'Total Tours',
      value: totalTours.toString(),
      change: '+6.2%',
      icon: MapIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      positive: true
    },
    {
      title: 'Upcoming Tours',
      value: upcomingTours.toString(),
      change: '+12%',
      icon: CalendarIcon,
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      positive: true
    },
    {
      title: 'Total Passengers',
      value: totalPassengers.toString(),
      change: '+24%',
      icon: UsersIcon,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      positive: true
    },
    {
      title: 'Total Revenue',
      value: `Rs ${totalRevenue.toLocaleString()}`,
      change: '+18%',
      icon: TrendingUpIcon,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      positive: true
    }
  ]
})

onMounted(() => {
  fetchTours()
  fetchCustomers()
})

const fetchTours = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const token = localStorage.getItem('token')
    
    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.list), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch tours')
    }

    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      tours.value = data.data
    } else {
      tours.value = []
    }

  } catch (error: any) {
    console.error('Error fetching tours:', error)
    errorMessage.value = error.message || 'Failed to load tours. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.customerlist), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch customers')
    }

    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      customers.value = data.data
    } else {
      customers.value = []
    }

  } catch (error: any) {
    console.error('Error fetching customers:', error)
  }
}

const getCustomerName = (customerId: any) => {
  // If customer_id is already populated with full customer object
  if (customerId && typeof customerId === 'object' && customerId.name) {
    return customerId.name
  }
  
  // If customer_id is just a string ID, look it up in customers array
  if (typeof customerId === 'string') {
    const customer = customers.value.find(c => c._id === customerId)
    return customer ? customer.name : 'Unknown Customer'
  }
  
  return 'Unknown Customer'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const resetTourForm = () => {
  tourForm.value = {
    customer_id: '',
    tourname: '',
    description: '',
    locations: '',
    passenger_count: '',
    totalprice: '',
    tourSchedule: [],
    starttime: '',
    pickup_locations: ''
  }
  newTourDate.value = ''
  errorMessage.value = ''
}

const openAddTourModal = () => {
  isEditMode.value = false
  editingTourId.value = null
  resetTourForm()
  showTourModal.value = true
}

const closeTourModal = () => {
  showTourModal.value = false
  resetTourForm()
  isEditMode.value = false
  editingTourId.value = null
}

const addTourDate = () => {
  if (newTourDate.value && !tourForm.value.tourSchedule.includes(newTourDate.value)) {
    tourForm.value.tourSchedule.push(newTourDate.value)
    tourForm.value.tourSchedule.sort()
    newTourDate.value = ''
  }
}

const removeTourDate = (index: number) => {
  tourForm.value.tourSchedule.splice(index, 1)
}

const handleSubmitTour = async () => {
  errorMessage.value = ''
  
  if (!tourForm.value.tourname || !tourForm.value.customer_id || !tourForm.value.description || 
      !tourForm.value.locations || !tourForm.value.passenger_count || 
      !tourForm.value.totalprice || !tourForm.value.starttime || !tourForm.value.pickup_locations) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }
  
  if (tourForm.value.tourSchedule.length === 0) {
    errorMessage.value = 'Please add at least one tour date'
    return
  }
  
  try {
    isLoading.value = true

    const tourData = {
      Coustomer_id: tourForm.value.customer_id,
      tourname: tourForm.value.tourname,
      description: tourForm.value.description,
      locations: tourForm.value.locations,
      passenger_count: tourForm.value.passenger_count,
      totalprice: parseFloat(tourForm.value.totalprice),
      tourSchedule: tourForm.value.tourSchedule,
      starttime: tourForm.value.starttime,
      pickup_locations: tourForm.value.pickup_locations
    }

    if (isEditMode.value && editingTourId.value) {
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.update), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
         body: JSON.stringify({
          id: editingTourId.value,
          ...tourData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update tour')
      }

    } else {
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.create), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tourData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create tour')
      }
    }

    closeTourModal()
    await fetchTours()
  } catch (error: any) {
    console.error('Error saving tour:', error)
    errorMessage.value = error.message || 'Failed to save tour. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const openEditTourModal = async (tourId: string) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const response = await fetch(buildApiUrl(`/api/tours/${tourId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch tour details')
    }

    const data = await response.json()
    
    if (data.data) {
      tourForm.value = {
        customer_id: data.data.customer_id || '',
        tourname: data.data.tourname || '',
        description: data.data.description || '',
        locations: data.data.locations || '',
        passenger_count: data.data.passenger_count?.toString() || '',
        totalprice: data.data.totalprice?.toString() || '',
        tourSchedule: [...(data.data.tourSchedule || [])],
        starttime: data.data.starttime || '',
        pickup_locations: data.data.pickup_locations || ''
      }
      
      isEditMode.value = true
      editingTourId.value = tourId
      showTourModal.value = true
    }
  } catch (error: any) {
    console.error('Error fetching tour details:', error)
    alert(error.message || 'Failed to load tour details. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const confirmDeleteTour = (tourId: string) => {
  deletingTourId.value = tourId
  errorMessage.value = ''
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deletingTourId.value = null
  errorMessage.value = ''
}

const deleteTour = async () => {
  if (!deletingTourId.value) return
  
  try {
    isDeleting.value = true
    errorMessage.value = ''

    const response = await fetch(buildApiUrl(`/api/tours/${deletingTourId.value}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete tour')
    }

    closeDeleteConfirm()
    await fetchTours()
  } catch (error: any) {
    console.error('Error deleting tour:', error)
    errorMessage.value = error.message || 'Failed to delete tour. Please try again.'
  } finally {
    isDeleting.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: scale(0.95);
}
</style>