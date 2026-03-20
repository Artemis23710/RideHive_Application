# Ride Hive — Vue 3 (converted from React)

This is a full conversion of the **Ride Hive** React application to **Vue 3** using the Composition API and `<script setup>` syntax.

## Tech Stack

| React (original)         | Vue 3 (this project)         |
|--------------------------|------------------------------|
| React 18                 | Vue 3.4                      |
| React Router v6          | Vue Router 4                 |
| React Context API        | Pinia (store)                |
| recharts                 | vue-chartjs + Chart.js       |
| lucide-react             | lucide-vue-next              |
| Tailwind CSS             | Tailwind CSS (unchanged)     |
| TypeScript               | TypeScript (unchanged)       |
| Vite + @vitejs/plugin-react | Vite + @vitejs/plugin-vue |

## Key Conversion Notes

- **State management**: `React.createContext` + `useContext` → **Pinia** store (`src/stores/theme.ts`)
- **Routing**: `<BrowserRouter>` + `<Routes>` → **Vue Router 4** (`src/router/index.ts`); route guards via `meta.minimal`
- **Components**: `.tsx` files → `.vue` Single File Components with `<template>`, `<script setup lang="ts">`, and `<style>`
- **Props**: `interface Props` + destructuring → `defineProps<Props>()`
- **Events**: `onChange` / `onSubmit` → `@change` / `@submit.prevent`
- **Reactive state**: `useState` → `ref` / `reactive`
- **Computed**: `useMemo` → `computed()`
- **Lifecycle**: `useEffect` → `watch` / `watchEffect` / `onMounted`
- **Charts**: `recharts` `<BarChart>` → `vue-chartjs` `<Bar>` with Chart.js registered plugins
- **Icons**: `lucide-react` → `lucide-vue-next`
- **Two-way binding**: Manual `value` + `onChange` → `v-model`
- **Conditional rendering**: `{condition && <El />}` → `v-if` / `v-else`
- **List rendering**: `.map(item => <El />)` → `v-for`

## Project Structure

```
src/
├── App.vue                    # Root component (replaces App.tsx)
├── main.ts                    # Entry point (replaces index.tsx)
├── index.css                  # Tailwind imports
├── router/
│   └── index.ts               # Vue Router config
├── stores/
│   └── theme.ts               # Pinia theme store
├── components/
│   ├── layout/
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   └── ui/
│       ├── AppButton.vue      # Renamed from Button.tsx
│       ├── SearchForm.vue
│       └── VehicleCard.vue
└── pages/
    ├── LandingPage.vue
    ├── LoginPage.vue
    ├── RegisterPage.vue
    ├── NotFoundPage.vue
    ├── customer/
    │   └── Dashboard.vue
    └── admin/
        └── Dashboard.vue
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Routes

| Path                   | Page                  |
|------------------------|-----------------------|
| `/`                    | Landing Page          |
| `/login`               | Login                 |
| `/register`            | Register              |
| `/customer/dashboard`  | Customer Dashboard    |
| `/admin/dashboard`     | Admin Dashboard       |
