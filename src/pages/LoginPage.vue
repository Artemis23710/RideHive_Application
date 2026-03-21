<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div class="text-center">
        <div class="flex justify-center">
          <Car class="h-12 w-12 text-teal-600" />
        </div>
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your Ride Hive account</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                placeholder="Email address"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="Password"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-teal-600 hover:text-teal-500">Forgot your password?</a>
          </div>
        </div>

        <div class="space-y-4">
          <AppButton type="submit" full-width>Sign in</AppButton>
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
          <AppButton type="button" variant="outline" full-width class="flex items-center justify-center">
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </AppButton>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <RouterLink to="/register" class="font-medium text-teal-600 hover:text-teal-500"> Sign up</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { Car, Mail, Lock } from 'lucide-vue-next'
import AppButton from '../components/ui/AppButton.vue'
import { buildApiUrl, API_CONFIG } from '../config/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)


const handleSubmit = async () => {
  // Basic validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    console.log('Login with:', {
      email: email.value,
      password: password.value
    })

    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.auth.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    if (data.message === 'Login successful') {
      console.log('Login successful:', data.data.user)
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.data.user))
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      // Redirect to admin page
      router.push('/customerdashboard')
    } else {
      throw new Error(data.error || 'Login failed')
    }

  } catch (error: any) {
    console.error('Login error:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage.value = 'Network error: Unable to connect to server'
    } else if (error.message === 'Invalid email or password') {
      errorMessage.value = 'Invalid email or password. Please try again.'
    } else {
      errorMessage.value = error.message || 'An error occurred during login. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}




</script>
