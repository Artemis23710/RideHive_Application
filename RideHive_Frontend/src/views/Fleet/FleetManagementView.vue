<script setup lang="ts">
import { ref,onMounted, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { buildApiUrl, API_CONFIG } from '@/config/api'
import {
  CarIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  WrenchIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  GridIcon,
  ListIcon,
  DollarSignIcon,
  TrashIcon,
  XIcon,
  RefreshCwIcon,
  UsersIcon,
  MapPinIcon,
  ImageIcon,
  UploadIcon
} from 'lucide-vue-next'

const viewMode = ref('table') 

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const showVehicleModal = ref(false)
const showDeleteConfirm = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const isEditMode = ref(false)
const editingVehicleId = ref<string | null>(null)
const deletingVehicleId = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const vehicles = ref<any[]>([])

const vehicleForm = ref({
  name: '',
  category: '',
  type: '',
  vehicleNumber: '',
  passengerCapacity: '',
  location: '',
  basePrice: '',
  status: 'Available',
  availabilitySchedule: [] as string[],
  photo: '',
  photoPreview: ''
})
const filteredVehicles = computed(() => {
  let filtered = vehicles.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(vehicle => 
      vehicle.name?.toLowerCase().includes(query) || 
      vehicle.vehicleNumber?.toLowerCase().includes(query)
    )
  }
  if (selectedCategory.value) {
    filtered = filtered.filter(vehicle => vehicle.category === selectedCategory.value)
  }
  if (selectedStatus.value) {
    filtered = filtered.filter(vehicle => vehicle.status === selectedStatus.value)
  }
  return filtered
})

const paginatedVehicles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredVehicles.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredVehicles.value.length / itemsPerPage.value)
})


const fleetStats = computed(() => {
  const totalvehicles = vehicles.value.length
  const avaliablevehicles = vehicles.value.filter(vehicle => vehicle.vehicalstatus === 'Available').length
  const bookedvehicles = vehicles.value.filter(vehicle => vehicle.vehicalstatus === 'Booked').length
  const maintenancevehicles = vehicles.value.filter(vehicle => vehicle.vehicalstatus === 'Maintenance').length

  return [
        {
        title: 'Total Vehicles',
        value: totalvehicles.toString(),
        change: '+8.2%',
        icon: CarIcon,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        positive: true
      },
      {
        title: 'Available',
        value: avaliablevehicles.toString(),
        change: '+12%',
        icon: TrendingUpIcon,
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        positive: true
      },
      {
        title: 'In Service',
        value: bookedvehicles.toString(),
        change: '-5%',
        icon: WrenchIcon,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        positive: false
      },
      {
        title: 'Maintenance Due',
        value: maintenancevehicles.toString(),
        change: '+2',
        icon: AlertTriangleIcon,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        positive: false
      }
  ]
})

// Fetch vehicles on component mount
onMounted(() => {
  fetchVehicles()
})


const fetchVehicles = async () => {
 
  try{
     isLoading.value = true
    errorMessage.value = ''
  
    const token = localStorage.getItem('token')

    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.vehicles.list), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch users')
    }

    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      vehicles.value = data.data
    } else {
      vehicles.value = []
    }

    console.log('Fetched vehicles:', vehicles.value)

  }catch (error: any) {
    console.error('Error fetching users:', error)
    errorMessage.value = error.message || 'Failed to load Vehicles . Please try again.'
  } finally {
    isLoading.value = false
  }

}


const resetVehicleForm = () => {
  vehicleForm.value = {
    name: '',
    category: '',
    type: '',
    vehicleNumber: '',
    passengerCapacity: '',
    location: '',
    basePrice: '',
    status: 'Available',
    availabilitySchedule: [],
    photo: '',
    photoPreview: ''
  }
  errorMessage.value = ''
}

const openAddVehicleModal = () => {
  isEditMode.value = false
  editingVehicleId.value = null
  resetVehicleForm()
  showVehicleModal.value = true
}



const closeVehicleModal = () => {
  showVehicleModal.value = false
  resetVehicleForm()
  isEditMode.value = false
  editingVehicleId.value = null
}


const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 5MB'
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      vehicleForm.value.photoPreview = e.target?.result as string
      vehicleForm.value.photo = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  vehicleForm.value.photo = ''
  vehicleForm.value.photoPreview = ''
}


// Vehicle add and update function
const handleSubmitVehicle = async () => {
  
  errorMessage.value = ''
  if (!vehicleForm.value.name || !vehicleForm.value.category || !vehicleForm.value.type || 
      !vehicleForm.value.vehicleNumber || !vehicleForm.value.passengerCapacity || 
      !vehicleForm.value.location || !vehicleForm.value.basePrice) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }
  if (parseInt(vehicleForm.value.passengerCapacity) < 1) {
    errorMessage.value = 'Passenger capacity must be at least 1'
    return
  }
  if (parseFloat(vehicleForm.value.basePrice) < 0) {
    errorMessage.value = 'Base price must be a positive number'
    return
  }
  try {
    isLoading.value = true

    if (isEditMode.value && editingVehicleId.value) {

     const Updatevehicle: any= {
        vehicalname: vehicleForm.value.name,
        category: vehicleForm.value.category,
        type: vehicleForm.value.type,
        vehicalnumber: vehicleForm.value.vehicleNumber,
        pasengercapacity: parseInt(vehicleForm.value.passengerCapacity),
        location: vehicleForm.value.location,
        baseprice: parseFloat(vehicleForm.value.basePrice),
        vehicalstatus: vehicleForm.value.status,
        availabilitySchedule: vehicleForm.value.availabilitySchedule,
        vehicalimage: vehicleForm.value.photo
      }

      const response = await fetch(buildApiUrl(`/api/vehicals/update`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: editingVehicleId.value,
          ...Updatevehicle
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update Vehicle')
      }

      // Update local state
      const index = vehicles.value.findIndex(u => u._id === editingVehicleId.value)
      if (index !== -1) {
        vehicles.value[index] = { ...vehicles.value[index], ...Updatevehicle }
      }

    } else {

      const newVehicle = {
        vehicalname: vehicleForm.value.name,
        category: vehicleForm.value.category,
        type: vehicleForm.value.type,
        vehicalnumber: vehicleForm.value.vehicleNumber,
        pasengercapacity: parseInt(vehicleForm.value.passengerCapacity),
        location: vehicleForm.value.location,
        baseprice: parseFloat(vehicleForm.value.basePrice),
        vehicalstatus: vehicleForm.value.status,
        availabilitySchedule: vehicleForm.value.availabilitySchedule,
        vehicalimage: vehicleForm.value.photo
      }


      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.vehicles.create), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newVehicle)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create Vehicle')
      }
      
     
    }

    closeVehicleModal()
    await fetchVehicles()
  } catch (error: any) {
    console.error('Error saving vehicle:', error)
    errorMessage.value = error.message || 'Failed to save vehicle. Please try again.'
  } finally {
    isLoading.value = false
  }
}


// Open Edit Vehicle Modal
const openEditVehicleModal = async (vehicleId: string) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const token = localStorage.getItem('token')
    
    // Fetch vehicle details by ID
    const response = await fetch(buildApiUrl(`/api/vehicals/?id=${vehicleId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch user details')
    }

    const data = await response.json()
    
    if (data.data) {
      // Populate form with user data
      vehicleForm.value = {
        name: data.data.vehicalname || '',
        category: data.data.category || '',
        type: data.data.type || '',
        vehicleNumber: data.data.vehicalnumber || '',
        passengerCapacity: data.data.pasengercapacity?.toString() || '0',
        location: data.data.location || '',
        basePrice: data.data.baseprice?.toString() || '0',
        status: data.data.vehicalstatus || 'Active',
        availabilitySchedule: [...data.data.availabilitySchedule],
        photo: data.data.vehicalimage || '',
        photoPreview: data.data.vehicalimage || ''
      }
      
      isEditMode.value = true
      editingVehicleId.value = vehicleId
      showVehicleModal.value = true
    }
  } catch (error: any) {
    console.error('Error fetching user details:', error)
    alert(error.message || 'Failed to load user details. Please try again.')
  } finally {
    isLoading.value = false
  }
}



// Delete Vehicle Functions
const confirmDeleteVehicle = (vehicleId: string) => {
  deletingVehicleId.value = vehicleId
  errorMessage.value = ''
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deletingVehicleId.value = null
  errorMessage.value = ''
}

const deleteVehicle = async () => {
  if (!deletingVehicleId.value) return
  try {
    isDeleting.value = true
    errorMessage.value = ''

     const response = await fetch(buildApiUrl(`/api/vehicals/${deletingVehicleId.value}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete user')
    }

    vehicles.value = vehicles.value.filter(vehicle => vehicle.id !== deletingVehicleId.value)

    closeDeleteConfirm()
    await fetchVehicles()
  } catch (error: any) {
    console.error('Error deleting vehicle:', error)
    errorMessage.value = error.message || 'Failed to delete vehicle. Please try again.'
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


<template>
<DashboardLayout user-type="admin">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Fleet Management
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage your vehicle fleet, maintenance, and availability
          </p>
        </div>
        <div class="flex space-x-3">
          <BaseButton @click="openAddVehicleModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Vehicle
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Fleet Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="(stat, index) in fleetStats" :key="index">
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
            placeholder="Search vehicles..."
            full-width
            :left-icon="SearchIcon"
          />
          
          <div class="relative">
            <select class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          
          <div class="relative">
            <select class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
          </div>
          
          <div class="relative">
            <select class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">All Locations</option>
              <option value="main">Main Depot</option>
              <option value="north">North Branch</option>
              <option value="south">South Branch</option>
            </select>
          </div>
          
          <BaseButton variant="outline" @click="fetchVehicles">
            <FilterIcon class="h-4 w-4 mr-2" />
            More Filters
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>

     <!-- Vehicles Grid/Table Toggle -->
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Fleet Vehicles ({{ vehicles.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              :class="viewMode === 'grid' ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700' : 'border-gray-300 dark:border-gray-600'"
              @click="viewMode = 'grid'"
            >
              <GridIcon class="h-4 w-4" />
              <span class="ml-2 hidden sm:inline">Grid</span>
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              :class="viewMode === 'table' ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700' : 'border-gray-300 dark:border-gray-600'"
              @click="viewMode = 'table'"
            >
              <ListIcon class="h-4 w-4" />
              <span class="ml-2 hidden sm:inline">Table</span>
            </BaseButton>
          </div>
        </div>

   
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="vehicle in vehicles" :key="vehicle.id" class="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <!-- Vehicle Image -->
        <div class="relative">
          <img
            v-if="vehicle.vehicalimage?.url"
             :src="`${apiBaseUrl}${vehicle.vehicalimage.url}`"
            :alt="vehicle.vehicalname"
            class="h-48 w-full object-cover"
          />
          <div v-else class="h-48 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <CarIcon class="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                vehicle.status === 'Available'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : vehicle.status === 'Booked'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`"
            >
              <div
                :class="`w-1.5 h-1.5 rounded-full mr-1 ${
                  vehicle.status === 'Available'
                    ? 'bg-green-400'
                    : vehicle.status === 'Booked'
                    ? 'bg-blue-400'
                    : 'bg-yellow-400'
                }`"
              ></div>
              {{ vehicle.status }}
            </span>
          </div>
          
          <!-- Price Badge -->
          <div class="absolute bottom-3 left-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full bg-black/70 text-white text-sm font-semibold backdrop-blur-sm">
              Rs{{ vehicle.baseprice }}/day
            </span>
          </div>
        </div>
        
        <!-- Vehicle Details -->
        <CardContent class="p-4">
          <!-- Vehicle Name and Category -->
          <div class="mb-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {{ vehicle.vehicalname }}
            </h3>
            <div class="flex items-center justify-between mt-1">
              <span class="text-sm font-medium text-teal-600 dark:text-teal-400">
                {{ vehicle.category }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {{ vehicle.type }}
              </span>
            </div>
          </div>
          
          <!-- Vehicle Number -->
          <div class="mb-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Vehicle Number</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ vehicle.vehicalnumber }}
            </p>
          </div>
          
          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- Capacity -->
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <UsersIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ vehicle.pasengercapacity }} seats
                </p>
              </div>
            </div>
            
            <!-- Location -->
            <div class="flex items-center space-x-2">
              <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <MapPinIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ vehicle.location }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Availability Schedule -->
          <div class="mb-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Available Days</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="day in daysOfWeek"
                :key="day"
                :class="`inline-flex items-center px-2 py-1 rounded text-xs ${
                  vehicle.availabilitySchedule.includes(day)
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 line-through'
                }`"
              >
                {{ day }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <BaseButton 
              size="sm" 
              variant="outline" 
              full-width
              @click="openEditVehicleModal(vehicle.id)"
            >
              <EditIcon class="h-4 w-4 mr-1" />
              Edit
            </BaseButton>
            <BaseButton 
              size="sm" 
              variant="outline" 
              full-width
              class="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              @click="confirmDeleteVehicle(vehicle.id)"
            >
              <TrashIcon class="h-4 w-4 mr-1" />
              Delete
            </BaseButton>
          </div>
        </CardContent>
      </BaseCard>
    </div>

 <!-- Vehicles Table -->
  <div v-else-if="viewMode === 'table'">
    <BaseCard>
      <CardHeader class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Vehicles ({{ filteredVehicles.length }})
        </h2>
        <div class="flex items-center space-x-2">
          <BaseButton variant="outline" size="sm" @click="fetchVehicles" :disabled="isLoading">
            <RefreshCwIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
            Refresh
          </BaseButton>
        </div>
      </CardHeader>
      
      <!-- Vehicles Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vehicle
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category/Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vehicle Number
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Base Price
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
            <tr v-for="vehicle in paginatedVehicles" :key="vehicle.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img
                    v-if="vehicle.vehicalimage"
                    :src="vehicle.vehicalimage"
                    :alt="vehicle.vehicalname"
                    class="h-10 w-10 rounded object-cover"
                  />
                  <div :class="vehicle.vehicalimage ? 'ml-4' : ''">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ vehicle.vehicalname }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ vehicle.category }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ vehicle.vehicalnumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <UsersIcon class="h-4 w-4 mr-1" />
                  {{ vehicle.pasengercapacity }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <MapPinIcon class="h-4 w-4 mr-1" />
                  {{ vehicle.location }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Rs{{ vehicle.baseprice }}/day
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'Available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : vehicle.status === 'Booked'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`"
                >
                  <div
                    :class="`w-1.5 h-1.5 rounded-full mr-1 ${
                      vehicle.status === 'Available'
                        ? 'bg-green-400'
                        : vehicle.status === 'Booked'
                        ? 'bg-blue-400'
                        : 'bg-yellow-400'
                    }`"
                  ></div>
                  {{ vehicle.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="openEditVehicleModal(vehicle._id)" class="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300">
                    <EditIcon class="h-5 w-5" />
                  </button>
                  <button @click="confirmDeleteVehicle(vehicle._id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredVehicles.length) }}</span> of
              <span class="font-medium">{{ filteredVehicles.length }}</span> vehicles
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
      <!-- Add/Edit Vehicle Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showVehicleModal"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeVehicleModal"
        >
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeVehicleModal"></div>
            <div class="relative w-full max-w-3xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ isEditMode ? 'Edit Vehicle' : 'Add New Vehicle' }}
                </h3>
                <button @click="closeVehicleModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XIcon class="h-5 w-5" />
                </button>
              </div>

              <form @submit.prevent="handleSubmitVehicle" class="px-6 py-4">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vehicle Photo
                    </label>
                    <div class="mt-2 flex items-center space-x-4">
                      <div v-if="vehicleForm.photoPreview" class="relative">
                        <img :src="vehicleForm.photoPreview" alt="Vehicle preview" class="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600" />
                        <button type="button" @click="removePhoto" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <XIcon class="h-4 w-4" />
                        </button>
                      </div>
                      <div v-else class="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <ImageIcon class="h-12 w-12 text-gray-400" />
                      </div>
                      <div class="flex-1">
                        <input type="file" ref="photoInput" accept="image/*" @change="handlePhotoUpload" class="hidden" />
                        <BaseButton type="button" variant="outline" size="sm" @click="$refs.photoInput.click()">
                          <UploadIcon class="h-4 w-4 mr-2" />
                          Upload Photo
                        </BaseButton>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Name <span class="text-red-500">*</span>
                      </label>
                      <BaseInput v-model="vehicleForm.name" placeholder="e.g., Toyota Camry 2024" full-width required />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category <span class="text-red-500">*</span>
                      </label>
                      <select v-model="vehicleForm.category" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="">Select category</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Van">Van</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type <span class="text-red-500">*</span>
                      </label>
                      <BaseInput v-model="vehicleForm.type" placeholder="e.g., Automatic, Manual" full-width required />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Number <span class="text-red-500">*</span>
                      </label>
                      <BaseInput v-model="vehicleForm.vehicleNumber" placeholder="e.g., ABC-1234" full-width required />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Passenger Capacity <span class="text-red-500">*</span>
                      </label>
                      <BaseInput v-model="vehicleForm.passengerCapacity" type="number" min="1" placeholder="e.g., 5" full-width required />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location <span class="text-red-500">*</span>
                      </label>
                      <BaseInput v-model="vehicleForm.location" placeholder="e.g., Colombo" full-width required />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Price (per day) <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input v-model="vehicleForm.basePrice" type="number" min="0" step="0.01" placeholder="0.00" required class="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status <span class="text-red-500">*</span>
                      </label>
                      <select v-model="vehicleForm.status" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Availability Schedule
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <label v-for="day in daysOfWeek" :key="day" class="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input type="checkbox" :value="day" v-model="vehicleForm.availabilitySchedule" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ day }}</span>
                      </label>
                    </div>
                    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Select the days when this vehicle is available for booking
                    </p>
                  </div>

                  <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <BaseButton type="button" variant="outline" @click="closeVehicleModal">Cancel</BaseButton>
                  <BaseButton type="submit" :disabled="isLoading">
                    <PlusIcon v-if="!isEditMode" class="h-4 w-4 mr-2" />
                    <EditIcon v-else class="h-4 w-4 mr-2" />
                    {{ isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Vehicle' : 'Add Vehicle') }}
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
                <h3 class="mt-4 text-lg font-semibold text-center text-gray-900 dark:text-white">Delete Vehicle</h3>
                <p class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this vehicle? This action cannot be undone.
                </p>
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                </div>
                <div class="mt-6 flex justify-center space-x-3">
                  <BaseButton type="button" variant="outline" @click="closeDeleteConfirm" :disabled="isDeleting">Cancel</BaseButton>
                  <BaseButton type="button" class="bg-red-600 hover:bg-red-700 text-white" @click="deleteVehicle" :disabled="isDeleting">
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