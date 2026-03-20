<template>
  <DashboardLayout user-type="admin">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Management
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage vehicle bookings, assignments, and schedules
          </p>
        </div>
        <div class="flex space-x-3">
          <BaseButton variant="outline">
            <DownloadIcon class="h-4 w-4 mr-2" />
            Export
          </BaseButton>
          <BaseButton @click="openAddBookingModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Create Booking
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Booking Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="(stat, index) in bookingStats" :key="index">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="p-3 rounded-lg" :class="stat.bgColor">
              <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
            </div>
            <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              stat.positive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`">
              {{ stat.change }}
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</p>
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
            placeholder="Search bookings..."
            full-width
            :left-icon="SearchIcon"
          />
          <div class="relative">
            <select v-model="selectedStatus" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="relative">
            <select v-model="selectedType" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Types</option>
              <option value="Tour">Tour</option>
              <option value="Transfer">Transfer</option>
              <option value="Day Hire">Day Hire</option>
              <option value="Airport Pickup">Airport Pickup</option>
            </select>
          </div>
          <div class="relative">
            <input
              v-model="selectedDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <BaseButton variant="outline" @click="fetchBookings">
            <FilterIcon class="h-4 w-4 mr-2" />
            More Filters
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>

    <!-- Bookings Table -->
    <div>
      <BaseCard>
        <CardHeader class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Bookings ({{ filteredBookings.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <BaseButton variant="outline" size="sm" @click="fetchBookings" :disabled="isLoading">
              <RefreshCwIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
              Refresh
            </BaseButton>
          </div>
        </CardHeader>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedBookings.length === 0">
                <td colspan="9" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <CalendarXIcon class="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p class="text-sm">No bookings found</p>
                </td>
              </tr>
              <tr v-for="booking in paginatedBookings" :key="booking._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.booking_name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ booking.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ getEntityName(booking.customer_id, customers) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CarIcon class="h-4 w-4 mr-1" />
                    {{ getEntityName(booking.vehicle_id, vehicles) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UserIcon class="h-4 w-4 mr-1" />
                    {{ booking.driver_id ? getEntityName(booking.driver_id, drivers) : '—' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ booking.booking_type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    {{ formatDate(booking.booking_date) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Rs {{ Number(booking.bookingprice).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusBadge(booking.bookingstatus)">
                    {{ booking.bookingstatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="openEditBookingModal(booking._id)" class="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300">
                      <EditIcon class="h-5 w-5" />
                    </button>
                    <button @click="confirmDeleteBooking(booking._id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }}</span> of
              <span class="font-medium">{{ filteredBookings.length }}</span> bookings
            </p>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <BaseButton variant="outline" size="sm" @click="prevPage" :disabled="currentPage === 1">Previous</BaseButton>
              <BaseButton
                v-for="page in totalPages"
                :key="page"
                :variant="currentPage === page ? 'primary' : 'outline'"
                size="sm"
                class="mx-1"
                @click="goToPage(page)"
              >{{ page }}</BaseButton>
              <BaseButton variant="outline" size="sm" @click="nextPage" :disabled="currentPage >= totalPages">Next</BaseButton>
            </nav>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Add/Edit Booking Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showBookingModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeBookingModal">
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeBookingModal"></div>
            <div class="relative w-full max-w-4xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all max-h-[90vh] overflow-y-auto">

              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ isEditMode ? 'Edit Booking' : 'Create New Booking' }}
                </h3>
                <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XIcon class="h-5 w-5" />
                </button>
              </div>

              <form @submit.prevent="handleSubmitBooking" class="px-6 py-4">
                <div class="space-y-6">

                  <!-- Basic Information -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Booking Name <span class="text-red-500">*</span>
                        </label>
                        <BaseInput v-model="bookingForm.booking_name" placeholder="e.g., Airport Transfer - John Doe" full-width required />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Booking Type <span class="text-red-500">*</span>
                        </label>
                        <select v-model="bookingForm.booking_type" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">Select type</option>
                          <option value="Tour">Tour</option>
                          <option value="Transfer">Transfer</option>
                          <option value="Day Hire">Day Hire</option>
                          <option value="Airport Pickup">Airport Pickup</option>
                          <option value="Airport Drop">Airport Drop</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>

                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          v-model="bookingForm.description"
                          rows="3"
                          placeholder="Describe the booking details, pickup point, destinations..."
                          required
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        ></textarea>
                      </div>

                    </div>
                  </div>

                  <!-- Assignment -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Assignment</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <!-- Customer -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Customer <span class="text-red-500">*</span>
                        </label>
                        <select v-model="bookingForm.customer_id" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">Select customer</option>
                          <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                            {{ customer.name }} — {{ customer.phone }}
                          </option>
                        </select>
                      </div>

                      <!-- Vehicle -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Vehicle <span class="text-red-500">*</span>
                        </label>
                        <select v-model="bookingForm.vehicle_id" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">Select vehicle</option>
                          <option v-for="vehicle in vehicles" :key="vehicle._id" :value="vehicle._id">
                            {{ vehicle.vehicalname }} — {{ vehicle.vehicalnumber }}
                          </option>
                        </select>
                      </div>

                      <!-- Driver -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Driver <span class="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <select v-model="bookingForm.driver_id" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">Select driver</option>
                          <option v-for="driver in drivers" :key="driver._id" :value="driver._id">
                            {{ driver.name }} — {{ driver.phone }}
                          </option>
                        </select>
                      </div>

                      <!-- Tour (optional) -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Linked Tour <span class="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <select v-model="bookingForm.tour_id" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="">No linked tour</option>
                          <option v-for="tour in tours" :key="tour._id" :value="tour._id">
                            {{ tour.tourname }}
                          </option>
                        </select>
                      </div>

                    </div>
                  </div>

                  <!-- Scheduling & Pricing -->
                  <div>
                    <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Scheduling & Pricing</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Booking Date <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="bookingForm.booking_date"
                          type="date"
                          required
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Booking Price (Rs) <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rs</span>
                          <input
                            v-model="bookingForm.bookingprice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Booking Status
                        </label>
                        <select v-model="bookingForm.bookingstatus" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  <!-- Error message -->
                  <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                  </div>

                </div>

                <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <BaseButton type="button" variant="outline" @click="closeBookingModal">Cancel</BaseButton>
                  <BaseButton type="submit" :disabled="isLoading">
                    <PlusIcon v-if="!isEditMode" class="h-4 w-4 mr-2" />
                    <EditIcon v-else class="h-4 w-4 mr-2" />
                    {{ isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Booking' : 'Create Booking') }}
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
                <h3 class="mt-4 text-lg font-semibold text-center text-gray-900 dark:text-white">Delete Booking</h3>
                <p class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this booking? This action cannot be undone.
                </p>
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                </div>
                <div class="mt-6 flex justify-center space-x-3">
                  <BaseButton type="button" variant="outline" @click="closeDeleteConfirm" :disabled="isDeleting">Cancel</BaseButton>
                  <BaseButton type="button" class="bg-red-600 hover:bg-red-700 text-white" @click="deleteBooking" :disabled="isDeleting">
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
  CalendarIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  RefreshCwIcon,
  CarIcon,
  UserIcon,
  CalendarXIcon
} from 'lucide-vue-next'

// ─── State ────────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const selectedDate = ref('')
const showBookingModal = ref(false)
const showDeleteConfirm = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const isEditMode = ref(false)
const editingBookingId = ref<string | null>(null)
const deletingBookingId = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const bookings = ref<any[]>([])
const customers = ref<any[]>([])
const vehicles = ref<any[]>([])
const drivers = ref<any[]>([])
const tours = ref<any[]>([])

const bookingForm = ref({
  customer_id: '',
  vehicle_id: '',
  tour_id: '',
  driver_id: '',
  booking_type: '',
  booking_name: '',
  description: '',
  bookingprice: '',
  booking_date: '',
  bookingstatus: 'Pending'
})


const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b =>
      b.booking_name?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.booking_type?.toLowerCase().includes(q) ||
      getEntityName(b.customer_id, customers.value).toLowerCase().includes(q)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(b => b.bookingstatus === selectedStatus.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(b => b.booking_type === selectedType.value)
  }

  if (selectedDate.value) {
    filtered = filtered.filter(b => b.booking_date === selectedDate.value)
  }

  return filtered
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredBookings.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / itemsPerPage.value)
)

const bookingStats = computed(() => {
  const total = bookings.value.length
  const confirmed = bookings.value.filter(b => b.bookingstatus === 'Confirmed').length
  const pending = bookings.value.filter(b => b.bookingstatus === 'Pending').length
  const totalRevenue = bookings.value
    .filter(b => b.bookingstatus !== 'Cancelled')
    .reduce((sum, b) => sum + (Number(b.bookingprice) || 0), 0)

  return [
    {
      title: 'Total Bookings',
      value: total.toString(),
      change: '+8.2%',
      icon: CalendarIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      positive: true
    },
    {
      title: 'Confirmed',
      value: confirmed.toString(),
      change: '+5%',
      icon: CheckCircleIcon,
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      positive: true
    },
    {
      title: 'Pending',
      value: pending.toString(),
      change: '-3%',
      icon: ClockIcon,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      positive: false
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


const getEntityName = (id: any, list: any[]) => {
  if (id && typeof id === 'object' && id.name) return id.name
  if (typeof id === 'string') {
    const found = list.find(i => i._id === id)
    return found ? found.name : 'Unknown'
  }
  return 'Unknown'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Pending:   'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Confirmed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    Cancelled: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    Completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
  return map[status] ?? map['Pending']
}

// ─── API Calls ────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

const fetchBookings = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const res = await fetch(buildApiUrl(API_CONFIG.endpoints.booking.list), { headers: authHeaders() })
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch bookings')
    const data = await res.json()
    bookings.value = Array.isArray(data.data) ? data.data : []
  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.customerlist), { headers: authHeaders() })
    const data = await res.json()
    customers.value = Array.isArray(data.data) ? data.data : []
  } catch (err) { console.error('Fetch customers error', err) }
}

const fetchVehicles = async () => {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.endpoints.vehicles.list), { headers: authHeaders() })
    const data = await res.json()
    vehicles.value = Array.isArray(data.data) ? data.data : []
  } catch (err) { console.error('Fetch vehicles error', err) }
}

const fetchDrivers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.booking.driverlist), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch drivers')
    }

    const data = await response.json()

    if (data.data && Array.isArray(data.data)) {
      // Filter only users with role 'driver' (adjust the role value to match your DB)
      drivers.value = data.data.filter((u: any) => u.role === 'Driver')
    } else {
      drivers.value = []
    }
  } catch (error: any) {
    console.error('Error fetching drivers:', error)
  }
}

const fetchTours = async () => {
  try {
    const res = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.list), { headers: authHeaders() })
    const data = await res.json()
    tours.value = Array.isArray(data.data) ? data.data : []
  } catch (err) { console.error('Fetch tours error', err) }
}

onMounted(() => {
  fetchBookings()
  fetchCustomers()
  fetchVehicles()
  fetchDrivers()
  fetchTours()
})


const resetForm = () => {
  bookingForm.value = {
    customer_id: '',
    vehicle_id: '',
    tour_id: '',
    driver_id: '',
    booking_type: '',
    booking_name: '',
    description: '',
    bookingprice: '',
    booking_date: '',
    bookingstatus: 'Pending'
  }
  errorMessage.value = ''
}

const openAddBookingModal = () => {
  isEditMode.value = false
  editingBookingId.value = null
  resetForm()
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  resetForm()
  isEditMode.value = false
  editingBookingId.value = null
}

const openEditBookingModal = async (bookingId: string) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const res = await fetch(buildApiUrl(`/api/bookings/${bookingId}`), { headers: authHeaders() })
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch booking')
    const data = await res.json()
    if (data.data) {
      const b = data.data
      bookingForm.value = {
        customer_id: typeof b.customer_id === 'object' ? b.customer_id._id : (b.customer_id || ''),
        vehicle_id:  typeof b.vehicle_id  === 'object' ? b.vehicle_id._id  : (b.vehicle_id  || ''),
        tour_id:     typeof b.tour_id     === 'object' ? b.tour_id._id     : (b.tour_id     || ''),
        driver_id:   typeof b.driver_id   === 'object' ? b.driver_id._id   : (b.driver_id   || ''),
        booking_type:   b.booking_type   || '',
        booking_name:   b.booking_name   || '',
        description:    b.description    || '',
        bookingprice:   b.bookingprice?.toString() || '',
        booking_date:   b.booking_date   || '',
        bookingstatus:  b.bookingstatus  || 'Pending'
      }
      isEditMode.value = true
      editingBookingId.value = bookingId
      showBookingModal.value = true
    }
  } catch (err: any) {
    alert(err.message || 'Failed to load booking details.')
  } finally {
    isLoading.value = false
  }
}

const handleSubmitBooking = async () => {
  errorMessage.value = ''

  const { booking_name, booking_type, description, customer_id, vehicle_id, bookingprice, booking_date } = bookingForm.value
  if (!booking_name || !booking_type || !description || !customer_id || !vehicle_id || !bookingprice || !booking_date) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  try {
    isLoading.value = true

    const payload = {
      customer_id:    bookingForm.value.customer_id,
      vehicle_id:     bookingForm.value.vehicle_id,
      tour_id:        bookingForm.value.tour_id ,
      driver_id:      bookingForm.value.driver_id ,
      booking_type:   bookingForm.value.booking_type,
      booking_name:   bookingForm.value.booking_name,
      description:    bookingForm.value.description,
      bookingprice:   bookingForm.value.bookingprice,
      booking_date:   bookingForm.value.booking_date,
      bookingstatus:  bookingForm.value.bookingstatus
    }

    let res: Response
    if (isEditMode.value && editingBookingId.value) {
      res = await fetch(buildApiUrl(API_CONFIG.endpoints.booking.update), {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            id: editingBookingId.value,
          ...payload
        })
      })
    } else {
      res = await fetch(buildApiUrl(API_CONFIG.endpoints.booking.create), {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })
    }

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || data.error || 'Failed to save booking')

    closeBookingModal()
    await fetchBookings()
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to save booking. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const confirmDeleteBooking = (bookingId: string) => {
  deletingBookingId.value = bookingId
  errorMessage.value = ''
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deletingBookingId.value = null
  errorMessage.value = ''
}

const deleteBooking = async () => {
  if (!deletingBookingId.value) return
  try {
    isDeleting.value = true
    errorMessage.value = ''
    const res = await fetch(buildApiUrl(`/api/bookings/${deletingBookingId.value}`), {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete booking')
    closeDeleteConfirm()
    await fetchBookings()
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to delete booking.'
  } finally {
    isDeleting.value = false
  }
}


const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToPage = (page: number) => { currentPage.value = page }
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