<template>
  <div :class="['mb-4', { 'w-full': fullWidth }]">
    <label
      v-if="label"
      :for="inputId"
      class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>
    
    <div class="relative">
      <div
        v-if="leftIcon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
      >
        <component :is="leftIcon" />
      </div>
      
      <input
        :id="inputId"
        :class="inputClasses"
        :value="modelValue"
        @input="handleInput"
        v-bind="$attrs"
      />
      
      <div
        v-if="rightIcon"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        :class="{ 'pointer-events-none': !rightIconClickable }"
      >
        <component :is="rightIcon" @click="handleRightIconClick" />
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import type { Component } from 'vue'

interface Props {
  label?: string
  error?: string
  fullWidth?: boolean
  leftIcon?: Component
  rightIcon?: Component
  rightIconClickable?: boolean
  modelValue?: string | number
}

interface Emits {
  'update:modelValue': [value: string]
  'rightIconClick': []
}

const props = withDefaults(defineProps<Props>(), {
  fullWidth: false,
  rightIconClickable: false
})

const emit = defineEmits<Emits>()

const inputId = useId()

const inputClasses = computed(() => {
  const classes = [
    'block px-4 py-2 rounded-lg border border-gray-300',
    'text-gray-900 bg-white',
    'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
    'dark:bg-gray-800 dark:border-gray-700 dark:text-white'
  ]
  
  if (props.leftIcon) classes.push('pl-10')
  if (props.rightIcon) classes.push('pr-10')
  if (props.error) classes.push('border-red-500 focus:ring-red-500 focus:border-red-500')
  if (props.fullWidth) classes.push('w-full')
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleRightIconClick = () => {
  if (props.rightIconClickable) {
    emit('rightIconClick')
  }
}
</script>