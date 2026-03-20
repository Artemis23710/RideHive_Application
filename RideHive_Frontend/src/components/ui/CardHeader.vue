<template>
  <div :class="`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: ''
})
</script>