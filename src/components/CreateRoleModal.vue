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
              Create New Role
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="createRole">
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    v-model="name"
                    type="text"
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
                  class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
