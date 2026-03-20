<template>
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component -->
      <div class="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="flex items-center flex-shrink-0 px-4">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=teal&shade=600"
            alt="Your Company"
          />
          <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>
        <div class="mt-5 flex-grow flex flex-col">
          <nav class="flex-1 px-2 space-y-1">
            <!-- Navigation items -->
            <a
              v-for="item in navigationItems"
              :key="item.name"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
              @click.prevent="setCurrentItem(item)"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current
                    ? 'text-teal-500 dark:text-teal-400'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                  'mr-3 flex-shrink-0 h-6 w-6'
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile sidebar -->
  <div v-if="mobileMenuOpen" class="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" @click="closeMobileMenu"></div>

    <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <button
          type="button"
          class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          @click="closeMobileMenu"
        >
          <span class="sr-only">Close sidebar</span>
          <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </div>

      <div class="flex-shrink-0 flex items-center px-4">
        <img
          class="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=teal&shade=600"
          alt="Your Company"
        />
        <h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>
      <div class="mt-5 flex-1 h-0 overflow-y-auto">
        <nav class="px-2 space-y-1">
          <a
            v-for="item in navigationItems"
            :key="item.name"
            :href="item.href"
            :class="[
              item.current
                ? 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
            ]"
            @click.prevent="setCurrentItem(item)"
          >
            <component
              :is="item.icon"
              :class="[
                item.current
                  ? 'text-teal-500 dark:text-teal-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                'mr-3 flex-shrink-0 h-6 w-6'
              ]"
              aria-hidden="true"
            />
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import {
  HomeIcon,
  CalendarIcon,
  CarIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  XMarkIcon
} from 'lucide-vue-next'

// Props
interface Props {
  mobileMenuOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobileMenuOpen: false
})

// Emits
const emit = defineEmits(['close-mobile-menu'])

// Navigation items
const navigationItems = ref([
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Bookings', href: '#', icon: CalendarIcon, current: false },
  { name: 'Fleet', href: '#', icon: CarIcon, current: false },
  { name: 'Customers', href: '#', icon: UsersIcon, current: false },
  { name: 'Analytics', href: '#', icon: ChartBarIcon, current: false },
  { name: 'Reports', href: '#', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '#', icon: CogIcon, current: false },
  { name: 'Users', href: '#', icon: CogIcon, current: false },
])

// Methods
const setCurrentItem = (selectedItem: any) => {
  navigationItems.value.forEach(item => {
    item.current = item.name === selectedItem.name
  })
}

const closeMobileMenu = () => {
  emit('close-mobile-menu')
}
</script>