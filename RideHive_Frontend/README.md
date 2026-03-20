# RideHive - Vue 3.5 Vehicle Rental Platform

This project is a modern vehicle rental platform built with Vue 3.5, featuring authentication, dashboards, and theme switching capabilities.

## Features

- **Authentication System** - Login and registration with form validation
- **Customer Dashboard** - Vehicle search, bookings management, and recommendations
- **Admin Dashboard** - Business analytics, fleet management, and booking oversight
- **Dark/Light Theme** - Automatic theme detection with manual toggle
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript support throughout the application

## Tech Stack

- **Vue 3.5** - Composition API with `<script setup>` syntax
- **TypeScript** - Full type safety and IntelliSense
- **Vue Router** - Client-side routing
- **Pinia** - State management for theme and app data
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue** - Beautiful, customizable icons
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── assets/          # Static assets and global CSS
├── components/      # Reusable Vue components
│   ├── ui/         # UI components (Button, Input, Card, etc.)
│   ├── Logo.vue    # Application logo
│   └── ThemeToggle.vue # Theme switcher
├── composables/     # Vue composables for reusable logic
├── layouts/         # Layout components
│   ├── AuthLayout.vue     # Authentication pages layout
│   └── DashboardLayout.vue # Dashboard layout with sidebar
├── stores/          # Pinia stores
│   └── theme.ts    # Theme management store
├── views/           # Page components
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── CustomerDashboardView.vue
│   └── AdminDashboardView.vue
├── router/          # Vue Router configuration
├── App.vue         # Root component
└── main.ts         # Application entry point
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Key Differences from React Version

### State Management
- **React**: Context API + useState/useReducer
- **Vue**: Pinia store with composition API

### Component Structure
- **React**: JSX with props interface
- **Vue**: SFC (Single File Components) with `<script setup>` and `defineProps`

### Routing
- **React**: React Router with BrowserRouter
- **Vue**: Vue Router with history mode

### Reactivity
- **React**: Manual dependency arrays and useEffect
- **Vue**: Built-in reactivity system with ref/reactive

### Theme Management
- **React**: Context + localStorage + useEffect
- **Vue**: Pinia store + watchers + composables

## Component Examples

### Vue Component (Composition API)
```vue
<template>
  <button :class="buttonClasses" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  // Computed styling logic
})

const handleClick = () => {
  emit('click')
}
</script>
```

### Pinia Store
```typescript
export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeType>('light')
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  // Watchers automatically handle side effects
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })
  
  return { theme, toggleTheme }
})
```

## Available Routes

- `/` or `/login` - Login page
- `/register` - Registration page  
- `/dashboard` - Customer dashboard
- `/admin` - Admin dashboard

## Theme System

The application supports both light and dark themes with:
- Automatic detection of user's system preference
- Manual toggle via theme button
- Persistent storage in localStorage
- Reactive updates across all components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure TypeScript compilation passes
5. Test the application thoroughly
6. Submit a pull request

## License

This project is licensed under the MIT License.