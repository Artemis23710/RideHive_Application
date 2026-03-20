import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import CustomerDashboard from '../pages/customer/Dashboard.vue'
import AdminDashboard from '../pages/admin/Dashboard.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/login', component: LoginPage, meta: { minimal: true } },
    { path: '/register', component: RegisterPage, meta: { minimal: true } },
    { path: '/customer/dashboard', component: CustomerDashboard },
    { path: '/admin/dashboard', component: AdminDashboard },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

export default router
