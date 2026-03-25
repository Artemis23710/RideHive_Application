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
          <AppButton>
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

      <!-- Recent Activity -->
      <h2 class="text-xl font-semibold page-title mb-4">Recent Activity</h2>
      <div class="activity-card rounded-lg shadow-md overflow-hidden mb-8">
        <ul class="divide-y activity-divider">
          <li v-for="activity in recentActivity" :key="activity.id" class="p-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium page-title">{{ activity.action }}</h4>
                <p class="text-sm page-sub mt-1">{{ activity.description }}</p>
              </div>
              <div class="text-sm page-sub flex items-center">
                <Clock class="h-4 w-4 mr-1" />
                <span>{{ activity.date }}, {{ activity.time }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Car,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
} from 'lucide-vue-next'
import AppButton from '../../components/ui/AppButton.vue'

import { useCurrentUser } from '../../stores/Usecurrentuser'
const { user } = useCurrentUser()

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

const recentActivity = [
  { id: '1', action: 'Booking Confirmed', description: 'Your booking for Tesla Model 3 has been confirmed.', date: '2023-11-30', time: '14:30' },
  { id: '2', action: 'Payment Processed', description: 'Payment of $445 has been processed successfully.', date: '2023-11-30', time: '14:25' },
  { id: '3', action: 'Tour Recommended', description: 'Based on your preferences, we recommend the City Explorer Tour.', date: '2023-11-29', time: '09:15' },
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
</style>