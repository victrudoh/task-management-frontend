<template>
  <div
    class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
  >
    <div
      class="w-14 h-14 flex items-center justify-center rounded-full mb-4"
      :class="iconBg"
    >
      <component :is="icon" class="w-7 h-7 text-white" />
    </div>
    <h3 class="text-lg font-semibold text-gray-800 mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-600 text-sm">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: Object, // Vue component for the icon
    required: true
  },
  iconBg: {
    type: String,
    default: 'bg-indigo-500'
  }
})
</script>
