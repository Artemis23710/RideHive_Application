<template>
  <DashboardLayout user-type="admin">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage Customer, roles, and permissions
          </p>
        </div>
        <div class="flex space-x-3">
          <BaseButton @click="openAddUserModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Customer
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard v-for="(stat, index) in userStats" :key="index">
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg" :class="stat.bgColor">
              <component
                :is="stat.icon"
                class="h-6 w-6"
                :class="stat.iconColor"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ stat.title }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </CardContent>
      </BaseCard>
    </div>

    <!-- Filters and Search -->
    <BaseCard class="mb-6">
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search users by name or email..."
            full-width
            :left-icon="SearchIcon"
          />
        
          
          <div class="relative">
            <select 
              v-model="selectedStatus"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          
          <BaseButton variant="outline" @click="fetchUsers">
            <FilterIcon class="h-5 w-5 mr-3" />
            Filter
          </BaseButton>
        </div>
      </CardContent>
    </BaseCard>

    <!-- Users Table -->
    <BaseCard>
      <CardHeader class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          Users ({{ filteredUsers.length }})
        </h2>
        <div class="flex items-center space-x-2">
          <BaseButton variant="outline" size="sm" @click="fetchUsers" :disabled="isLoading">
            <RefreshCwIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
            Refresh
          </BaseButton>
        </div>
      </CardHeader>
      
      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone
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
            <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'Admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : user.role === 'User'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.phone || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : user.status === 'Inactive'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`"
                >
                  <div
                    :class="`w-1.5 h-1.5 rounded-full mr-1 ${
                      user.status === 'Active'
                        ? 'bg-green-400'
                        : user.status === 'Inactive'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`"
                  ></div>
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="openEditUserModal(user._id)" class="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300">
                    <EditIcon class="h-5 w-5" />
                  </button>
                  <button @click="confirmDeleteUser(user._id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> of{' '}
              <span class="font-medium">{{ filteredUsers.length }}</span> users
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <BaseButton variant="outline" size="sm" @click="prevPage" :disabled="currentPage === 1">Previous</BaseButton>
              <BaseButton 
                v-for="page in totalPages" 
                :key="page"
                :variant="currentPage === page ? 'default' : 'outline'" 
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

    <!-- Add/Edit User Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUserModal"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeUserModal"
        >
          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-black/50 transition-opacity"
              @click="closeUserModal"
            ></div>

            <!-- Modal -->
            <div
              class="relative w-full max-w-2xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all"
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ isEditMode ? 'Edit User' : 'Add New User' }}
                </h3>
                <button
                  @click="closeUserModal"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Modal Body -->
              <form @submit.prevent="handleSubmitUser" class="px-6 py-4">
                <div class="space-y-4">
                  <!-- Full Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="userForm.name"
                      placeholder="Enter full name"
                      full-width
                      required
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="userForm.email"
                      type="email"
                      placeholder="Enter email address (used for login)"
                      full-width
                      required
                      :disabled="isEditMode"
                    />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ isEditMode ? 'Email cannot be changed' : 'This email will be used for login' }}
                    </p>
                  </div>

                  <!-- Phone Number -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <BaseInput
                      v-model="userForm.phone"
                      type="tel"
                      placeholder="Enter phone number"
                      full-width
                    />
                  </div>

                  <!-- Password (only for add mode or if changing password) -->
                  <div v-if="!isEditMode || showPasswordFields">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password <span v-if="!isEditMode" class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <BaseInput
                        v-model="userForm.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Enter password"
                        full-width
                        :required="!isEditMode"
                      />
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <EyeIcon v-if="!showPassword" class="h-4 w-4" />
                        <EyeOffIcon v-else class="h-4 w-4" />
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <!-- Change Password Toggle (Edit mode only) -->
                  <div v-if="isEditMode && !showPasswordFields">
                    <BaseButton type="button" variant="outline" size="sm" @click="showPasswordFields = true">
                      Change Password
                    </BaseButton>
                  </div>

                  <!-- Confirm Password -->
                  <div v-if="(!isEditMode || showPasswordFields) && userForm.password">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password <span v-if="!isEditMode" class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="userForm.confirmPassword"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Confirm password"
                      full-width
                      :required="!isEditMode"
                    />
                  </div>
                  <!-- Status -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="userForm.status"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <!-- Error Message -->
                  <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="mt-6 flex justify-end space-x-3">
                  <BaseButton
                    type="button"
                    variant="outline"
                    @click="closeUserModal"
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton type="submit" :disabled="isLoading">
                    <PlusIcon v-if="!isEditMode" class="h-4 w-4 mr-2" />
                    <EditIcon v-else class="h-4 w-4 mr-2" />
                    {{ isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Customer' : 'Add Customer') }}
                  </BaseButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Custom Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeDeleteConfirm"
        >
          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-black/50 transition-opacity"
              @click="closeDeleteConfirm"
            ></div>

            <!-- Modal -->
            <div
              class="relative w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all"
            >
              <!-- Modal Body -->
              <div class="p-6">
                <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
                  <TrashIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                
                <h3 class="mt-4 text-lg font-semibold text-center text-gray-900 dark:text-white">
                  Delete Customer
                </h3>
                
                <p class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this Customer? This action cannot be undone.
                </p>

                <!-- Error Message -->
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
                </div>

                <!-- Modal Footer -->
                <div class="mt-6 flex justify-center space-x-3">
                  <BaseButton
                    type="button"
                    variant="outline"
                    @click="closeDeleteConfirm"
                    :disabled="isDeleting"
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton 
                    type="button"
                    class="bg-red-600 hover:bg-red-700 text-white"
                    @click="deleteUser"
                    :disabled="isDeleting"
                  >
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
  UsersIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  XIcon,
  RefreshCwIcon
} from 'lucide-vue-next'

// Reactive data
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showUserModal = ref(false)
const showDeleteConfirm = ref(false)
const showPassword = ref(false)
const showPasswordFields = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isDeleting = ref(false)
const isEditMode = ref(false)
const editingUserId = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)
const users = ref<any[]>([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// User form data 
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'Customer',
  status: 'Active'
})

// Filtered users based on search and filters
const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query)
    )
  }


  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  return filtered
})

// Computed pagination
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

// Stats computed from users data
const userStats = computed(() => {
  const totalUsers = users.value.length
  const activeUsers = users.value.filter(user => user.status === 'Active').length
  const admins = users.value.filter(user => user.role === 'Inactive').length
  
  // Calculate new users this month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const newThisMonth = users.value.filter(user => {
    if (!user.createdAt) return false
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === currentMonth && 
           userDate.getFullYear() === currentYear
  }).length

  return [
    {
      title: 'Total Customer',
      value: totalUsers.toString(),
      icon: UsersIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Customer',
      value: activeUsers.toString(),
      icon: UserIcon,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Inactive Customer',
      value: admins.toString(),
      icon: ShieldCheckIcon,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'New This Month',
      value: newThisMonth.toString(),
      icon: ClockIcon,
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400'
    }
  ]
})

// Fetch users on component mount
onMounted(() => {
  fetchUsers()
})

// Fetch users from MongoDB
const fetchUsers = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const token = localStorage.getItem('token')
    
    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.users.list), {
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
       users.value = data.data.filter((u: any) => u.role === 'Customer')
    } else {
      users.value = []
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    errorMessage.value = error.message || 'Failed to load users. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Reset user form
const resetUserForm = () => {
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    status: 'Active'
  }
  errorMessage.value = ''
  showPassword.value = false
  showPasswordFields.value = false
}

// Open Add User Modal
const openAddUserModal = () => {
  isEditMode.value = false
  editingUserId.value = null
  resetUserForm()
  showUserModal.value = true
}

// Open Edit User Modal
const openEditUserModal = async (userId: string) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const token = localStorage.getItem('token')
    
    // Fetch user details by ID
    const response = await fetch(buildApiUrl(`/api/users/?id=${userId}`), {
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
      userForm.value = {
        name: data.data.name || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        password: '',
        confirmPassword: '',
        role: data.data.role || 'Customer',
        status: data.data.status || 'Active'
      }
      
      isEditMode.value = true
      editingUserId.value = userId
      showUserModal.value = true
    }
  } catch (error: any) {
    console.error('Error fetching user details:', error)
    alert(error.message || 'Failed to load user details. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Close User Modal
const closeUserModal = () => {
  showUserModal.value = false
  resetUserForm()
  isEditMode.value = false
  editingUserId.value = null
}

// Handle Submit User (Add or Edit)
const handleSubmitUser = async () => {
  errorMessage.value = ''

  // Validation
  if (userForm.value.password || userForm.value.confirmPassword) {
    if (userForm.value.password !== userForm.value.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    if (userForm.value.password.length < 8) {
      errorMessage.value = 'Password must be at least 8 characters long'
      return
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userForm.value.email)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  try {
    isLoading.value = true
    const token = localStorage.getItem('token')
    
    if (isEditMode.value && editingUserId.value) {
      // Update existing user
      const updateData: any = {
        name: userForm.value.name,
        phone: userForm.value.phone || '',
        role: userForm.value.role,
        status: userForm.value.status
      }
      
      // Only include password if it was changed
      if (userForm.value.password) {
        updateData.password = userForm.value.password
      }
      
      const response = await fetch(buildApiUrl(`/api/users/update`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id: editingUserId.value,
          ...updateData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update user')
      }

      // Update local state
      const index = users.value.findIndex(u => u._id === editingUserId.value)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updateData }
      }
      
      closeUserModal()
      await fetchUsers() // Refresh list
      
    } else {
      // Create new user
      const userData = {
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone || '',
        password: userForm.value.password,
        role: userForm.value.role,
        status: userForm.value.status
      }
      
      const response = await fetch(buildApiUrl(API_CONFIG.endpoints.users.create), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create user')
      }
      
      closeUserModal()
      await fetchUsers() // Refresh list
    }
  } catch (error: any) {
    console.error('Error saving user:', error)
    errorMessage.value = error.message || 'Failed to save user. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Confirm Delete User
const confirmDeleteUser = (userId: string) => {
  deletingUserId.value = userId
  errorMessage.value = ''
  showDeleteConfirm.value = true
}

// Close Delete Confirmation
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deletingUserId.value = null
  errorMessage.value = ''
}

// Delete User
const deleteUser = async () => {
  if (!deletingUserId.value) return

  try {
    isDeleting.value = true
    errorMessage.value = ''
    
    
    const response = await fetch(buildApiUrl(`/api/users/${deletingUserId.value}`), {
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

    // Remove from local state
    users.value = users.value.filter(user => user._id !== deletingUserId.value)
    
    closeDeleteConfirm()
  } catch (error: any) {
    console.error('Error deleting user:', error)
    errorMessage.value = error.message || 'Failed to delete user. Please try again.'
  } finally {
    isDeleting.value = false
  }
}

// Pagination functions
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