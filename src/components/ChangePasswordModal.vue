<template>
  <TransitionRoot as="template" :show="props.isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <!-- Background overlay -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <!-- Modal content -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl border border-gray-100"
          >
            <!-- Title -->
            <DialogTitle class="text-lg font-semibold text-gray-900 mb-6">
              Change Password
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="changePassword">
              <div class="space-y-5">
                <!-- Input fields -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    v-model="newPassword"
                    type="password"
                    required
                    class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    v-model="confirmNewPassword"
                    type="password"
                    required
                    class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore'

const toast = useToastStore()
const props = defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits(['close', 'passwordChanged'])

const newPassword = ref('')
const confirmNewPassword = ref('')

const closeModal = () => {
  emits('close')
}

const changePassword = () => {

  if (newPassword.value !== confirmNewPassword.value) {
    toast.error('Passwords do not match')
    return
  }
  if (newPassword.value.length < 6) {
    toast.error('Password must be at least 6 characters long')
    return
  }

  // Call the API to change the password
  // Assuming we have a method in authStore to change the password
  const authStore = useAuthStore()
  try{
    authStore.updatePassword({newPassword: newPassword.value})
    .then(() => {
      emits('passwordChanged')}
    )
    // Reset fields
    newPassword.value = ''
    confirmNewPassword.value = ''
    closeModal()

  } catch (error:any) {
    toast.error(error)
    console.error('Error changing password:', error)
    return
  }
}
</script>
