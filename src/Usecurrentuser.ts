import { ref } from 'vue'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export function useCurrentUser() {
  const user = ref<User | null>(null)

  try {
    const raw = localStorage.getItem('user')
    if (raw) {
      user.value = JSON.parse(raw)
    }
  } catch {
    user.value = null
  }

  return { user }
}