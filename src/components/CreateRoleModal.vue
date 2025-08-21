<template>
  <TransitionRoot as="template" :show="isOpen">
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
            class="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
          >
            <!-- Title -->
            <DialogTitle class="text-lg font-semibold text-gray-900 mb-4">
              Create New Role
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="createRole">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    v-model="name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                  Create Role
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

const props = defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits(['close', 'roleCreated'])

const name = ref('')

const closeModal = () => {
  emits('close')
}

const createRole = () => {
  const newRole = {
    name: name.value,
  }

  emits('roleCreated', newRole)
  closeModal()

  // Reset fields
  name.value = ''
}
</script>
