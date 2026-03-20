<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Mobile sidebar -->
    <div
      v-show="sidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      aria-hidden="true"
    >
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-75"
        aria-hidden="true"
        @click="sidebarOpen = false"
      ></div>
      
      <div class="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800 shadow-xl">
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Logo />
          <button
            type="button"
            class="rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            @click="sidebarOpen = false"
          >
            <XIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto py-4 px-3">
          <nav class="flex-1 space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <component
                :is="item.icon"
                class="mr-3 h-6 w-6 text-teal-600 dark:text-teal-600"
                aria-hidden="true"
              />
              {{ item.name }}
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
    
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800">
      <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Logo />
      </div>
      
      <div class="flex-1 flex flex-col overflow-y-auto">
        <nav class="flex-1 space-y-2">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-4 py-3 text-lg font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <component
                :is="item.icon"
                class="mr-4 h-6 w-6 text-teal-600 dark:text-teal-600"
                aria-hidden="true"
              />
              {{ item.name }}
            </RouterLink>
          </nav>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="lg:pl-64 flex flex-col flex-1">
      <!-- Top navigation -->
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              @click="sidebarOpen = true"
            >
              <MenuIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div class="flex-1 px-2 lg:px-0">
            <div class="max-w-md w-full lg:max-w-xs">
              <label for="search" class="sr-only">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <button class="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
            
            <ThemeToggle />
            
            <div class="ml-3 relative">
              <div>
                <button class="flex items-center max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                </button>
              </div>
            </div>
            
            <button @click="handleLogout" class="ml-3 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <LogOutIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      
      <!-- Main content area -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink,useRouter  } from 'vue-router'
import Logo from '@/components/Logo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  CalendarIcon,
  UserIcon,
  BellIcon,
  LogOutIcon,
  SearchIcon,
  TruckIcon,      
  MapIcon,        
  CalendarCheckIcon , 
  BarChartIcon,   
  FileTextIcon,  
  SettingsIcon,  
  UsersIcon,
  ShieldIcon       
} from 'lucide-vue-next'

interface Props {
  userType?: 'customer' | 'admin'
}

const props = withDefaults(defineProps<Props>(), {
  userType: 'customer'
})

const router = useRouter()
const sidebarOpen = ref(false)

const customerNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon }
]

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Fleet', href: '/fleets', icon: TruckIcon },
  { name: 'Tours', href: '/tours', icon: MapIcon },
  { name: 'Booking', href: '/booking', icon: CalendarCheckIcon  },
  { name: 'Customers', href: '/customer', icon: UsersIcon },
  { name: 'Reports', href: '/admin/analytics', icon: FileTextIcon },
  { name: 'Users', href: '/users', icon: ShieldIcon  }
]

const navItems = computed(() => {
  return props.userType === 'admin' ? adminNavItems : customerNavItems
})

const handleLogout = () => {
  // Remove user data from localStorage
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  
  // Redirect to login page
  router.push('/login')
}

</script>