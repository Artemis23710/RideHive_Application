<template>
  <div :class="`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`">
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