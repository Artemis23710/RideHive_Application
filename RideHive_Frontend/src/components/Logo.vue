<template>
  <div class="flex items-center">
    <span :class="`font-bold ${sizeClasses[size]} text-teal-600 dark:text-teal-400`">
      Ride
      <span class="text-gray-800 dark:text-white">Hive</span>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl'
}
</script>