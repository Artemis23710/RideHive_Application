<template>
  <!-- ===== DASHBOARD NAV (customer dashboard only) ===== -->
  <header v-if="isDashboard" class="sticky top-0 z-50 shadow-sm transition-colors duration-200"
    :class="themeStore.theme === 'dark' ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
       <RouterLink to="/" class="flex items-center space-x-2">
          <Car class="h-8 w-8 text-teal-600" />
          <span class="text-xl font-bold text-teal-600">Ride Hive</span>
        </RouterLink>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">

          <!-- Theme Toggle -->
          <button @click="themeStore.toggleTheme()"
            class="dash-icon-btn"
            :aria-label="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`">
            <Moon v-if="themeStore.theme === 'light'" class="h-5 w-5" />
            <Sun v-else class="h-5 w-5" />
          </button>

          <!-- Notifications -->
          <button class="dash-icon-btn relative" aria-label="Notifications">
            <Bell class="h-5 w-5" />
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2"
              :class="themeStore.theme === 'dark' ? 'border-slate-900' : 'border-white'"></span>
          </button>

           <button class="dash-icon-btn relative" @click="handleLogout">
                  <LogOut class="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  </header>

  <!-- ===== ORIGINAL WEBSITE NAV (all other pages) ===== -->
  <header v-else class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2">
          <Car class="h-8 w-8 text-teal-600" />
          <span class="text-xl font-bold text-teal-600">Ride Hive</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav v-if="!minimal" class="hidden md:flex items-center space-x-8">
          <a href="/#home" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Home</a>
          <a href="/#about" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">About</a>
          <a href="/#vehicles" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Vehicles</a>
          <a href="/#tours" class="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">Tours</a>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center space-x-4">
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            :aria-label="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`"
          >
            <Moon v-if="themeStore.theme === 'light'" class="h-5 w-5 text-gray-600" />
            <Sun v-else class="h-5 w-5 text-gray-300" />
          </button>

          <div v-if="!minimal" class="hidden md:flex items-center space-x-4">
            <RouterLink to="/login">
              <AppButton variant="secondary">Log in</AppButton>
            </RouterLink>
            <RouterLink to="/register">
              <AppButton>Sign up</AppButton>
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            v-if="!minimal"
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" class="h-6 w-6" />
            <Menu v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen && !minimal" class="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
        <a href="/#home" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Home</a>
        <a href="/#about" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">About</a>
        <a href="/#vehicles" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Vehicles</a>
        <a href="/#tours" class="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Tours</a>
        <div class="px-4 pt-2 flex flex-col space-y-2">
          <RouterLink to="/login" @click="mobileMenuOpen = false">
            <AppButton variant="secondary" full-width>Log in</AppButton>
          </RouterLink>
          <RouterLink to="/register" @click="mobileMenuOpen = false">
            <AppButton full-width>Sign up</AppButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Car, Moon, Sun, Menu, X, Bell,
  LayoutDashboard, CalendarDays, MapPin, ReceiptText,
  User as UserIcon, Settings, ShieldCheck, HelpCircle,
  LogOut, ChevronDown,
} from 'lucide-vue-next'
import { useThemeStore } from '../../stores/theme'
import AppButton from '../ui/AppButton.vue'
import { RouterLink,useRouter  } from 'vue-router'

const router = useRouter()

defineProps<{
  minimal?: boolean
  isDashboard?: boolean   // ← pass this as true on the customer dashboard route
}>()

const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)

// Dashboard dropdown
const menuOpen = ref(false)
const accountRef = ref<HTMLElement | null>(null)

function handleLogout() {
  // Remove user data from localStorage
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  
  // Redirect to login page
  router.push('/login')
}

function handleOutsideClick(e: MouseEvent) {
  if (accountRef.value && !accountRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');

/* ===== DASHBOARD NAV STYLES ===== */
.dash-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
  color: #6b7280;
}

.dash-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.dash-link.active {
  background: #f0fdfa;
  color: #0d9488;
}

:global(.dark) .dash-link { color: #94a3b8; }
:global(.dark) .dash-link:hover { background: #1e293b; color: #f1f5f9; }
:global(.dark) .dash-link.active { background: #134e4a; color: #2dd4bf; }

.dash-icon-btn {
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

.dash-icon-btn:hover { background: #f3f4f6; color: #111827; }
:global(.dark) .dash-icon-btn { color: #94a3b8; }
:global(.dark) .dash-icon-btn:hover { background: #1e293b; color: #f1f5f9; }

/* Dropdown items */
.dd-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background 0.12s ease;
  color: #374151;
  font-family: inherit;
}

.dd-item:hover { background: #f3f4f6; color: #111827; }
:global(.dark) .dd-item { color: #cbd5e1; }
:global(.dark) .dd-item:hover { background: #334155; color: #f1f5f9; }

.dd-icon { width: 15px; height: 15px; color: #9ca3af; flex-shrink: 0; }

.dd-logout { color: #dc2626; }
.dd-logout .dd-icon { color: #dc2626; }
.dd-logout:hover { background: #fef2f2 !important; color: #b91c1c !important; }
:global(.dark) .dd-logout { color: #f87171; }
:global(.dark) .dd-logout .dd-icon { color: #f87171; }
:global(.dark) .dd-logout:hover { background: #450a0a !important; color: #fca5a5 !important; }

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>