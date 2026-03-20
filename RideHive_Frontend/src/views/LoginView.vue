<template>
  <AuthLayout
    title="Sign in to your account"
    subtitle="Your journey starts here"
  >
    <div class="mt-8">
      <!-- Social login buttons -->
      <div class="flex justify-center">
        <div class="flex space-x-4">
          <button class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg class="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="mt-6 relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>
      
      <!-- Error Message Display -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-800 dark:text-red-200 text-sm font-medium">{{ errorMessage }}</span>
        </div>
      </div>
      
      <!-- Login form -->
      <form class="mt-6 space-y-6" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          required
          full-width
          :left-icon="MailIcon"
          :disabled="isLoading"
        />
        
        <div class="space-y-1">
          <BaseInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="••••••••"
            required
            full-width
            :left-icon="LockIcon"
            :right-icon="showPassword ? EyeOffIcon : EyeIcon"
            right-icon-clickable
            @right-icon-click="togglePasswordVisibility"
            :disabled="isLoading"
          />
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                :disabled="isLoading"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
        
        <BaseButton 
          type="submit" 
          full-width
          :disabled="isLoading"
          :loading="isLoading"
        >
          <template v-if="isLoading">
            Signing in...
          </template>
          <template v-else>
            Sign in
          </template>
        </BaseButton>
        
        <div class="text-center text-sm">
          <span class="text-gray-600 dark:text-gray-400">
            Don't have an account?
          </span>
          <RouterLink
            to="/register"
            class="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 ml-1"
          >
            Sign up
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { buildApiUrl, API_CONFIG } from '@/config/api'

const router = useRouter()
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

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
      router.push('/admin')
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