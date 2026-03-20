import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import CustomerDashboardView from '@/views/CustomerDashboardView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import UsersView from '@/views/Users/UsersView.vue'
import FleetManagementView from '@/views/Fleet/FleetManagementView.vue'
import TourManagementView from '@/views/Tour/TourManagementView.vue'
import BookingManagement from '@/views/Booking/BookingManagement.vue'
import CustomerView from '@/views/Customer/CustomerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login',
      name: 'loginPage',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: CustomerDashboardView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/fleets',
      name: 'fleets',
      component: FleetManagementView
    },
    {
      path: '/tours',
      name: 'tours',
      component: TourManagementView
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingManagement
    },
    {
      path: '/customer',
      name: 'customer',
      component: CustomerView
    }
  ]
})

export default router