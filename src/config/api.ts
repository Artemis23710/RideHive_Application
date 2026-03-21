export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
    },
    users: {
      list: '/api/users/all',
      create: '/api/users/create',
      update: '/api/users/update',
      delete: '/api/users/delete',
      stats: '/api/users/stats'
    },
    vehicles: {
      list: '/api/vehicals/all',
      create: '/api/vehicals/create',
      update: '/api/vehicals/update',
      delete: '/api/vehicals/delete',
      stats: '/api/vehicals/stats'
    },
     tours: {
      list: '/api/tours/all',
      create: '/api/tours/create',
      update: '/api/tours/update',
      delete: '/api/tours/delete',
      customerlist: '/api/tours/customerlist',
    },
    booking: {
      list: '/api/bookings/all',
      create: '/api/bookings/create',
      update: '/api/bookings/update',
      delete: '/api/bookings/delete',
      driverlist: '/api/users/all',
    },
    
  }
} as const

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`
}