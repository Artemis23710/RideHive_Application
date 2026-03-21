<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div class="text-center">
        <div class="flex justify-center">
          <Car class="h-12 w-12 text-teal-600" />
        </div>
        <h2 class="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Join Ride Hive and start your journey</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
            <div>
              <label for="firstName" class="sr-only">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  v-model="formData.fullName"
                  type="text"
                  required
                  placeholder="Full Name"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

          <div>
            <label for="email" class="sr-only">Email address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="formData.email"
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
                v-model="formData.password"
                type="password"
                autocomplete="new-password"
                required
                placeholder="Password"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="formData.termsAccepted"
            type="checkbox"
            required
            class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            I agree to the
            <a href="#" class="font-medium text-teal-600 hover:text-teal-500">Terms of Service</a>
            and
            <a href="#" class="font-medium text-teal-600 hover:text-teal-500">Privacy Policy</a>
          </label>
        </div>

        <div class="space-y-4">
          <AppButton type="submit" full-width>Sign up</AppButton>
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
          Already have an account?
          <RouterLink to="/login" class="font-medium text-teal-600 hover:text-teal-500"> Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Car, Mail, Lock, User as UserIcon } from 'lucide-vue-next'
import AppButton from '../components/ui/AppButton.vue'
import { buildApiUrl, API_CONFIG } from '../config/api'

const router = useRouter()


const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')


const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  termsAccepted: false,
})

const handleSubmit = async () => {
  // Basic validation
  if (!formData.fullName || !formData.email || !formData.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (!formData.termsAccepted) {
    errorMessage.value = 'Please accept the terms and conditions'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  if (formData.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    console.log('Register with:', {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    })

    const response = await fetch(buildApiUrl(API_CONFIG.endpoints.auth.register), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed')
    }

    // Check for success based on the actual API response structure
    if (response.ok && data.message === 'User created successfully') {
      successMessage.value = data.message || 'Registration successful!'
      console.log('Registration successful:', data.data)
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login') // This matches your route name 'loginPage'
      }, 2000)
    } else {
      throw new Error(data.error || data.message || 'Registration failed')
    }

  } catch (error: any) {
    console.error('Registration error:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage.value = 'Network error: Unable to connect to server. Please try again later.'
    } else if (error.message.includes('Email already exists') || error.message.includes('User already exists')) {
      errorMessage.value = 'An account with this email already exists. Please use a different email or login.'
    } else if (error.message.includes('Invalid email') || error.message.includes('email format')) {
      errorMessage.value = 'Please enter a valid email address.'
    } else if (error.message.includes('password') || error.message.includes('Password')) {
      errorMessage.value = 'Password requirements not met. Please try a different password.'
    } else {
      errorMessage.value = error.message || 'An error occurred during registration. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
