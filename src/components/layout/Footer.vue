<template>
  <footer class="bg-gray-100 dark:bg-gray-800 pt-12 pb-8" :class="{ '!pt-0': isDashboard }">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Full footer — shown on all pages except dashboard -->
      <template v-if="!isDashboard">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1">
            <RouterLink to="/" class="flex items-center space-x-2">
              <Car class="h-8 w-8 text-teal-600" />
              <span class="text-xl font-bold text-teal-600">Ride Hive</span>
            </RouterLink>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Perfect for vehicle rentals, tours, and fleet booking management.
            </p>
            <div class="mt-6 flex space-x-4">
              <a href="#" class="text-gray-500 hover:text-teal-600"><Facebook class="h-5 w-5" /></a>
              <a href="#" class="text-gray-500 hover:text-teal-600"><Twitter class="h-5 w-5" /></a>
              <a href="#" class="text-gray-500 hover:text-teal-600"><Instagram class="h-5 w-5" /></a>
            </div>
          </div>

          <!-- Company -->
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Company</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="/#about" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">About Us</a></li>
              <li><a href="/#careers" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Careers</a></li>
              <li><a href="/#contact" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Contact Us</a></li>
              <li><a href="/#blog" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Blog</a></li>
            </ul>
          </div>

          <!-- Services -->
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Services</h3>
            <ul class="mt-4 space-y-2">
              <li><a href="/#vehicles" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Vehicle Rentals</a></li>
              <li><a href="/#tours" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Guided Tours</a></li>
              <li><a href="/#fleet-management" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Fleet Management</a></li>
              <li><a href="/#business" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">For Business</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="col-span-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Support</h3>
            <ul class="mt-4 space-y-2">
              <li><RouterLink to="/help" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Help Center</RouterLink></li>
              <li><RouterLink to="/faq" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">FAQ</RouterLink></li>
              <li><RouterLink to="/terms" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Terms of Service</RouterLink></li>
              <li><RouterLink to="/privacy" class="text-gray-600 dark:text-gray-400 hover:text-teal-600">Privacy Policy</RouterLink></li>
            </ul>
          </div>
        </div>
      </template>

      <!-- Copyright bar — always shown -->
      <div :class="isDashboard ? 'py-4' : 'mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'">
        <p class="text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Ride Hive. All rights reserved.
        </p>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { Car, Facebook, Twitter, Instagram } from 'lucide-vue-next'

defineProps<{ isDashboard?: boolean }>()
</script>