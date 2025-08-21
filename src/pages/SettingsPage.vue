<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'

const authStore = useAuthStore()
const userStore = useUserStore()

const name = ref(authStore.user.name)
const email = ref(authStore.user.email)
const isModalOpen = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const saveChanges = () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  const updatedUser = {
    name: name.value,
    email: email.value,
  }

  authStore.updateMe(updatedUser)
    .then(() => {
      console.log('User updated:', updatedUser)
      successMessage.value = 'Profile updated successfully'
      errorMessage.value = ''
      // refresh the page
      window.location.reload()
  
    })
    .catch(error => {
      console.error('Error updating user:', error)
    })
}

const passwordChanged = () => {
  // Optionally, you can show a success message or refresh the user data
  successMessage.value='Password changed successfully'
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Settings</h1>

    <div class="bg-white p-4 rounded shadow">
      <label class="block mb-2">Name</label>
      <!-- Success/error message -->
      <div v-if="successMessage" class="text-green-600 mb-2">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="text-red-600 mb-2">
        {{ errorMessage }}
      </div>
      <input v-model="name" class="border p-2 w-full mb-4" />

      <label class="block mb-2">Email</label>
      <input v-model="email" class="border p-2 w-full mb-4" />

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
