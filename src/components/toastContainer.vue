<!-- components/ToastContainer.vue -->
<template>
  <div class="fixed top-20 right-4 space-y-2 z-50">
    <transition-group name="fade" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="px-4 py-2 rounded shadow text-white text-sm flex items-center space-x-2"
        :class="toastColor(toast.type)"
      >
        <span>{{ toast.message }}</span>
        <button @click="toastStore.removeToast(toast.id)" class="ml-2">✖</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from "@/store/toastStore"

const toastStore = useToastStore()

const toastColor = (type) => {
  switch (type) {
    case "success":
      return "bg-green-500"
    case "error":
      return "bg-red-500"
    case "warning":
      return "bg-yellow-500 text-black"
    case "info":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
