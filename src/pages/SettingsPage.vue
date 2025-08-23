<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { useToastStore } from '@/store/toastStore'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const toast = useToastStore()

const name = ref(authStore.user.name)
const email = ref(authStore.user.email)
const isModalOpen = ref(false)

const saveChanges = () => {  
  const updatedUser = {
    name: name.value,
    email: email.value,
  }

  authStore.updateMe(updatedUser)
    .then(() => {
      console.log('User updated:', updatedUser)
      toast.success('Profile updated successfully')
      // refresh the page
      window.location.reload()
  
    })
    .catch(error => {
      toast.error('Failed to update profile')
      console.error('Error updating user:', error)
    })
}

const passwordChanged = () => {
  // Optionally, you can show a success message or refresh the user data
  toast.success('Password changed successfully')
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Settings</h1>

    <div class="bg-white p-4 rounded shadow">
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <!-- Success/error message -->
      <input v-model="name" 
      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm" />

      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input v-model="email" 
      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm" />

      <div class="flex justify-end space-x-2">
        <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
        <button @click="isModalOpen=true" class="bg-red-500 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </div>
    </div>
    <ChangePasswordModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @passwordChanged="passwordChanged"
    />
  </div>
</template>
