import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import CustomerDashboard from '../pages/customer/Dashboard.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',  name: '/', component: LandingPage },
    { path: '/login',name: 'login', component: LoginPage, meta: { minimal: true } },
    { path: '/register',name: 'register', component: RegisterPage, meta: { minimal: true } },
    { path: '/customerdashboard',name: 'customerdashboard', component: CustomerDashboard },
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
