<template>
  <div >
    <!-- ===== DASHBOARD CONTENT ===== -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold page-title">Welcome back, {{ user?.name ?? 'Guest' }}</h1>
          <p class="page-sub">Manage your bookings and explore new adventures</p>
        </div>
        <div class="mt-4 md:mt-0">
         <AppButton @click="openTourModal">
            <Car class="h-4 w-4 mr-2" />
            New Booking
          </AppButton>
        </div>
      </div>

      <!-- Upcoming Bookings -->
      <h2 class="text-xl font-semibold page-title mb-4">Your Upcoming Bookings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          v-for="booking in upcomingBookings"
          :key="booking.id"
          class="booking-card rounded-lg shadow-md overflow-hidden"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/3">
              <img :src="booking.image" :alt="booking.vehicleName" class="w-full h-full object-cover" />
            </div>
            <div class="p-4 md:w-2/3">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold page-title">{{ booking.vehicleName }}</h3>
                <span :class="['text-xs px-2 py-1 rounded-full', booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending']">
                  {{ capitalize(booking.status) }}
                </span>
              </div>
              <div class="mt-2 space-y-2 text-sm page-sub">
                <div class="flex items-center">
                  <CalendarIcon class="h-4 w-4 mr-2 icon-muted" />
                  <span>{{ formatDate(booking.startDate) }} – {{ formatDate(booking.endDate) }}</span>
                </div>
                <div class="flex items-center">
                  <MapPin class="h-4 w-4 mr-2 icon-muted" />
                  <span>{{ booking.location }}</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <div>
                  <span class="font-bold text-teal-600">${{ booking.price }}</span>
                  <span class="text-sm page-sub"> total</span>
                </div>
                <AppButton variant="secondary" size="sm">View Details</AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div class="mb-6 flex justify-between items-center">
         <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
           Booking
         </h2>
         <div class="flex items-center space-x-2">
         </div>
       </div>

    <div>
      <BaseCard>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking Name
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
              </tr>
            </thead>

            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="tour in tours" :key="tour._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ tour.tourname }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ tour.description }}
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
              </tr>
            </tbody>
          </table>
        </div>

      </BaseCard>
    </div>
    
  </div>

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
 
              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Booking</h3>
                <button @click="closeTourModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <X class="h-5 w-5" />
                </button>
              </div>
 
              <!-- Modal Form -->
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
                        <input
                          v-model="tourForm.tourname"
                          placeholder="e.g., Sigiriya & Dambulla Day Tour"
                          required
                          class="modal-input"
                        />
                      </div>
 
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Locations <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="tourForm.locations"
                          placeholder="e.g., Sigiriya, Dambulla, Minneriya"
                          required
                          class="modal-input"
                        />
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
                          class="modal-input resize-none"
                        ></textarea>
                      </div>
 
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Passenger Count <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="tourForm.passenger_count"
                          type="number"
                          min="1"
                          placeholder="e.g., 4"
                          required
                          class="modal-input"
                        />
                      </div>
 
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pickup Location <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="tourForm.pickup_locations"
                          placeholder="e.g., Colombo Airport"
                          required
                          class="modal-input"
                        />
                      </div>
 
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Time <span class="text-red-500">*</span>
                        </label>
                        <input
                          v-model="tourForm.starttime"
                          type="time"
                          required
                          class="modal-input"
                        />
                      </div>
 
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Total Price (Rs) <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rs</span>
                          <input
                            v-model="tourForm.totalprice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                            class="modal-input pl-10"
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
                            class="modal-input"
                          />
                        </div>
                        <button
                          type="button"
                          @click="addTourDate"
                          class="modal-btn-primary flex items-center gap-2"
                        >
                          <Plus class="h-4 w-4" /> Add Date
                        </button>
                      </div>
 
                      <div v-if="tourForm.tourSchedule.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Selected Dates ({{ tourForm.tourSchedule.length }})
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="(date, idx) in tourForm.tourSchedule"
                            :key="idx"
                            class="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-sm"
                          >
                            {{ formatDate(date) }}
                            <button type="button" @click="removeTourDate(idx)" class="ml-2 hover:text-teal-900 dark:hover:text-teal-100">
                              <X class="h-3.5 w-3.5" />
                            </button>
                          </span>
                        </div>
                      </div>
 
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Add all the dates when this tour will be available.
                      </p>
                    </div>
                  </div>
 
                  <!-- Error -->
                  <div v-if="modalError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ modalError }}</p>
                  </div>
 
                </div>
 
                <!-- Footer Actions -->
                <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" @click="closeTourModal" class="modal-btn-outline">Cancel</button>
                  <button type="submit" :disabled="isSubmitting" class="modal-btn-primary flex items-center gap-2">
                    <Plus class="h-4 w-4" />
                    {{ isSubmitting ? 'Creating...' : 'Create Booking' }}
                  </button>
                </div>
              </form>
 
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


  </div>
</template>

<script setup lang="ts">
import { ref ,onMounted } from 'vue'
import {
  Car,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Plus,
  X,
} from 'lucide-vue-next'
import AppButton from '../../components/ui/AppButton.vue'
import { useCurrentUser } from '../../Usecurrentuser'
import { buildApiUrl, API_CONFIG } from '../../config/api'
 
const { user } = useCurrentUser()

// --- New Booking Modal ---
const showTourModal = ref(false)
const isSubmitting = ref(false)
const modalError = ref('')
const newTourDate = ref('')
 
const tourForm = ref({
  tourname: '',
  description: '',
  locations: '',
  passenger_count: '',
  totalprice: '',
  tourSchedule: [] as string[],
  starttime: '',
  pickup_locations: '',
})

const tours = ref<any[]>([])
 
function openTourModal() {
  showTourModal.value = true
  modalError.value = ''
}

onMounted(() => {
  fetchTours()
})


const fetchTours = async () => {
  try {
    
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
    tours.value = data.data.filter((tour: any) => {
      const tourCustomerId = typeof tour.customer_id === 'object'
        ? tour.customer_id?._id
        : tour.customer_id
      return tourCustomerId === user.value?._id
    })
  } else {
    tours.value = []
  }

  } catch (error: any) {
    console.error('Error fetching tours:', error)
  }
}
 
function closeTourModal() {
  showTourModal.value = false
  modalError.value = ''
  newTourDate.value = ''
  tourForm.value = {
    tourname: '',
    description: '',
    locations: '',
    passenger_count: '',
    totalprice: '',
    tourSchedule: [],
    starttime: '',
    pickup_locations: '',
  }
}
 
function addTourDate() {
  if (newTourDate.value && !tourForm.value.tourSchedule.includes(newTourDate.value)) {
    tourForm.value.tourSchedule.push(newTourDate.value)
    tourForm.value.tourSchedule.sort()
    newTourDate.value = ''
  }
}
 
function removeTourDate(index: number) {
  tourForm.value.tourSchedule.splice(index, 1)
}
 
async function handleSubmitTour() {
  modalError.value = ''
 
  if (!tourForm.value.tourname  || !tourForm.value.locations ||
      !tourForm.value.passenger_count || !tourForm.value.totalprice ||
      !tourForm.value.starttime || !tourForm.value.pickup_locations) {
    modalError.value = 'Please fill in all required fields.'
    return
  }
 
  if (tourForm.value.tourSchedule.length === 0) {
    modalError.value = 'Please add at least one tour date.'
    return
  }
 
  try {
    isSubmitting.value = true
    const token = localStorage.getItem('token')
    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.tours.create), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        Coustomer_id: user.value?._id,
        tourname: tourForm.value.tourname,
        description: tourForm.value.description,
        locations: tourForm.value.locations,
        passenger_count: tourForm.value.passenger_count,
        totalprice: parseFloat(tourForm.value.totalprice),
        tourSchedule: tourForm.value.tourSchedule,
        starttime: tourForm.value.starttime,
        pickup_locations: tourForm.value.pickup_locations,
      }),
    })
 
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Failed to create booking.')
    }
 
    closeTourModal()
    fetchTours()
  } catch (error: any) {
    modalError.value = error.message || 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// --- Data ---
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


function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
 
/* ===== ROOT ===== */
.dashboard-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: #f9fafb;
  color: #111827;
  transition: background 0.2s ease, color 0.2s ease;
}
 
.dashboard-root.dark {
  background: #0f172a;
  color: #f1f5f9;
}
 
/* ===== SEMANTIC HELPERS ===== */
.page-title { color: inherit; }
.page-sub   { color: #6b7280; }
.dark .page-sub { color: #94a3b8; }
.icon-muted { color: #9ca3af; }
 
/* ===== NAV ===== */
.dashboard-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  transition: background 0.2s ease, border-color 0.2s ease;
}
 
.dark .dashboard-nav {
  background: #0f172a;
  border-bottom-color: #1e293b;
  box-shadow: 0 1px 16px rgba(0,0,0,0.4);
}
 
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
 
/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
 
.logo-icon {
  width: 22px;
  height: 22px;
  color: #0d9488;
}
 
.logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0d9488;
  letter-spacing: -0.02em;
}
 
/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
 
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.15s ease;
}
 
.nav-link:hover { background: #f3f4f6; color: #111827; }
.nav-link.active { background: #f0fdfa; color: #0d9488; }
 
.dark .nav-link { color: #94a3b8; }
.dark .nav-link:hover { background: #1e293b; color: #f1f5f9; }
.dark .nav-link.active { background: #134e4a; color: #2dd4bf; }
 
.link-icon { width: 15px; height: 15px; }
 
/* Right Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
 
.icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.15s ease;
}
 
.icon-btn:hover { background: #f3f4f6; color: #111827; }
.dark .icon-btn { color: #94a3b8; }
.dark .icon-btn:hover { background: #1e293b; color: #f1f5f9; }
 
.action-icon { width: 18px; height: 18px; }
 
.notif-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 7px; height: 7px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}
 
.dark .notif-dot { border-color: #0f172a; }
 
/* Account Button */
.account-wrapper { position: relative; }
 
.account-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.75rem 0.35rem 0.35rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'DM Sans', sans-serif;
}
 
.account-btn:hover { border-color: #0d9488; background: #f0fdfa; }
.dark .account-btn { background: #1e293b; border-color: #334155; }
.dark .account-btn:hover { border-color: #0d9488; background: #134e4a; }
 
.avatar { position: relative; width: 30px; height: 30px; }
 
.avatar-img {
  width: 30px; height: 30px;
  border-radius: 8px;
  object-fit: cover;
}
 
.online-dot {
  position: absolute;
  bottom: -1px; right: -1px;
  width: 8px; height: 8px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #fff;
}
 
.dark .online-dot { border-color: #1e293b; }
 
.account-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
 
.account-name { font-size: 0.85rem; font-weight: 600; color: #111827; }
.account-role { font-size: 0.7rem; color: #9ca3af; }
.dark .account-name { color: #f1f5f9; }
 
.chevron { width: 14px; height: 14px; color: #9ca3af; transition: transform 0.2s ease; }
.chevron.rotated { transform: rotate(180deg); }
 
/* Dropdown */
.account-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 100;
}
 
.dark .account-dropdown {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
}
 
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
}
 
.dark .dropdown-header { background: #0f172a; }
 
.dropdown-avatar { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
 
.dropdown-name { font-size: 0.875rem; font-weight: 600; color: #111827; margin: 0; }
.dropdown-email { font-size: 0.75rem; color: #6b7280; margin: 0; }
.dark .dropdown-name { color: #f1f5f9; }
 
.dropdown-divider { height: 1px; background: #e5e7eb; margin: 0.25rem 0; }
.dark .dropdown-divider { background: #334155; }
 
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.12s ease;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
}
 
.dropdown-item:hover { background: #f3f4f6; color: #111827; }
.dark .dropdown-item { color: #cbd5e1; }
.dark .dropdown-item:hover { background: #334155; color: #f1f5f9; }
 
.di-icon { width: 15px; height: 15px; color: #6b7280; }
 
.logout-item { color: #dc2626; }
.logout-item .di-icon { color: #dc2626; }
.logout-item:hover { background: #fef2f2; color: #b91c1c; }
.dark .logout-item { color: #f87171; }
.dark .logout-item .di-icon { color: #f87171; }
.dark .logout-item:hover { background: #450a0a; color: #fca5a5; }
 
/* ===== CONTENT CARDS ===== */
.booking-card {
  background: #ffffff;
  transition: background 0.2s ease;
}
.dark .booking-card { background: #1e293b; }
 
.activity-card {
  background: #ffffff;
  transition: background 0.2s ease;
}
.dark .activity-card { background: #1e293b; }
 
.activity-divider > li + li { border-top: 1px solid #e5e7eb; }
.dark .activity-divider > li + li { border-top-color: #334155; }
 
/* Badges */
.badge-confirmed { background: #dcfce7; color: #166534; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 9999px; }
.badge-pending   { background: #fef9c3; color: #854d0e; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 9999px; }
.dark .badge-confirmed { background: rgba(22,163,74,0.2); color: #4ade80; }
.dark .badge-pending   { background: rgba(234,179,8,0.2);  color: #facc15; }
 
/* ===== ANIMATIONS ===== */
.theme-icon-enter-active,
.theme-icon-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.theme-icon-enter-from   { opacity: 0; transform: rotate(-90deg) scale(0.7); }
.theme-icon-leave-to     { opacity: 0; transform: rotate(90deg) scale(0.7); }
 
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to     { opacity: 0; transform: translateY(-6px) scale(0.97); }
 
/* ===== MOBILE ===== */
@media (max-width: 768px) {
  .nav-links    { display: none; }
  .account-info { display: none; }
  .chevron      { display: none; }
}
 
/* ===== MODAL ===== */
.modal-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}
 
.modal-input:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
}
 
.dashboard-root.dark .modal-input {
  background: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}
 
.dashboard-root.dark .modal-input:focus {
  border-color: #2dd4bf;
  box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.15);
}
 
.modal-input::placeholder { color: #9ca3af; }
 
.modal-btn-primary {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  background: #0d9488;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  font-family: 'DM Sans', sans-serif;
}
 
.modal-btn-primary:hover:not(:disabled) { background: #0f766e; }
.modal-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
 
.modal-btn-outline {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  background: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'DM Sans', sans-serif;
}
 
.modal-btn-outline:hover { background: #f9fafb; border-color: #9ca3af; }
.dashboard-root.dark .modal-btn-outline { color: #e2e8f0; border-color: #475569; }
.dashboard-root.dark .modal-btn-outline:hover { background: #1e293b; }
 
/* Modal animation */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-active > div > div:last-child,
.modal-leave-active > div > div:last-child { transition: transform 0.25s ease; }
.modal-enter-from > div > div:last-child,
.modal-leave-to > div > div:last-child { transform: scale(0.95); }
</style>